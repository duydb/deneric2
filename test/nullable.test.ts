import { it, describe, expect } from 'vitest'
import Deneric, { DenericSchema } from '../src/Deneric'

class Address extends Deneric {
  city: string = ''

  constructor(data?: any) {
    super({ city: ['city', String] })
    this.fromJson(data)
  }
}

class Profile extends Deneric {
  age: number | null = null
  name: string | null = null
  active: boolean | null = null
  tags: string[] | null = null
  meta: object | null = null
  address: Address | null = null
  scores: (number | null)[] = []
  ratings: Record<string, number | null> = {}

  constructor(data?: any, strict?: boolean) {
    super({
      age: ['age', Deneric.Nullable(Number)],
      name: ['name', Deneric.Nullable(String)],
      active: ['active', Deneric.Nullable(Boolean)],
      tags: ['tags', Deneric.Nullable(Deneric.Array(String))],
      meta: ['meta', Deneric.Nullable(Object)],
      address: ['address', Deneric.Nullable(Address)],
      scores: ['scores', Deneric.Array(Deneric.Nullable(Number))],
      ratings: ['ratings', Deneric.Map(Deneric.Nullable(Number))],
    })
    this.fromJson(data, strict)
  }
}

describe('Deneric.Nullable', () => {
  it.each([
    ['missing field (undefined)', {}],
    ['explicit null', { age: null, name: null, active: null, tags: null, meta: null, address: null }],
    ['no data at all', undefined],
  ])('resolves to null: %s', (_, json) => {
    const p = new Profile(json)
    expect(p.age).toBeNull()
    expect(p.name).toBeNull()
    expect(p.active).toBeNull()
    expect(p.tags).toBeNull()
    expect(p.meta).toBeNull()
    expect(p.address).toBeNull()
  })

  it('keeps valid values, including falsy ones', () => {
    const p = new Profile({ age: 0, name: '', active: false, tags: [], meta: {}, address: { city: 'HN' } })
    expect(p.age).toBe(0)
    expect(p.name).toBe('')
    expect(p.active).toBe(false)
    expect(p.tags).toEqual([])
    expect(p.meta).toEqual({})
    expect(p.address).toBeInstanceOf(Address)
    expect(p.address?.city).toBe('HN')
  })

  it('resolves wrong types to null in strict mode', () => {
    const p = new Profile({ age: '12', name: 1, active: 'yes', tags: 'a', meta: [1] })
    expect(p.age).toBeNull()
    expect(p.name).toBeNull()
    expect(p.active).toBeNull()
    expect(p.tags).toBeNull()
    expect(p.meta).toBeNull()
  })

  it('coerces in non-strict mode, NaN becomes null', () => {
    expect(new Profile({ age: '12' }, false).age).toBe(12)
    expect(new Profile({ age: 'abc' }, false).age).toBeNull()
    expect(new Profile({ age: null }, false).age).toBeNull()
    expect(new Profile({}, false).age).toBeNull()
  })

  it('keeps null items inside Array and Map', () => {
    const p = new Profile({ scores: [1, null, 3, undefined], ratings: { a: 5, b: null } })
    expect(p.scores).toEqual([1, null, 3, null])
    expect(p.ratings).toEqual({ a: 5, b: null })
  })

  it('toJson emits null instead of the type default', () => {
    const json = new Profile({ scores: [1, null] }).toJson()
    expect(json).toEqual({
      age: null,
      name: null,
      active: null,
      tags: null,
      meta: null,
      address: null,
      scores: [1, null],
      ratings: {},
    })
  })

  it('toJson serializes values set after parsing', () => {
    const p = new Profile({ age: 5, address: { city: 'HN' } })
    expect(p.toJson()).toMatchObject({ age: 5, address: { city: 'HN' } })
    p.age = null
    p.address = null
    expect(p.toJson()).toMatchObject({ age: null, address: null })
  })
})

describe('default value fixes', () => {
  it('respects an explicit null default in the schema', () => {
    class A extends Deneric {
      age: number | null = null

      constructor(data?: any) {
        super({ age: ['age', Number, false, null] })
        this.fromJson(data)
      }
    }
    const a = new A({})
    expect(a.age).toBeNull()
    expect(a.toJson()).toEqual({ age: null })
    expect(new A({ age: 7 }).age).toBe(7)
  })

  it('does not share default arrays/objects between instances', () => {
    const SCHEMA: DenericSchema = { roles: ['roles', Array], meta: ['meta', Object] }
    class B extends Deneric {
      roles: string[] = ['x']
      meta: Record<string, any> = { a: 1 }

      constructor(data?: any) {
        super(SCHEMA)
        this.fromJson(data)
      }
    }
    const first = new B({})
    first.roles.push('LEAK')
    first.meta.b = 2

    const second = new B({})
    expect(second.roles).toEqual(['x'])
    expect(second.meta).toEqual({ a: 1 })
    expect(second.roles).not.toBe(first.roles)
  })

  it('does not share defaults through toJson output', () => {
    class C extends Deneric {
      roles: string[] = ['x']

      constructor(data?: any) {
        super({ roles: ['roles', Array, false, ['x']] })
        this.fromJson(data)
      }
    }
    const c = new C({})
    // @ts-ignore
    c.roles = undefined
    const json = c.toJson() as { roles: string[] }
    json.roles.push('LEAK')
    expect(new C({}).roles).toEqual(['x'])
  })

  it('toJson does not crash when a nested entity is null', () => {
    class D extends Deneric {
      address!: Address | null

      constructor(data?: any) {
        super({ address: ['address', Address] })
        this.fromJson(data)
      }
    }
    const d = new D({ address: { city: 'HN' } })
    d.address = null
    expect(() => d.toJson()).not.toThrow()
    expect(d.toJson()).toEqual({ address: null })
  })
})

describe('Deneric.Nullable custom default (invalid values)', () => {
  it('uses the schema default for wrong types, keeps null/undefined as null', () => {
    class A extends Deneric {
      age: number | null = null

      constructor(data?: any) {
        super({ age: ['age', Deneric.Nullable(Number), false, -1] })
        this.fromJson(data)
      }
    }
    expect(new A({ age: '12' }).age).toBe(-1)
    expect(new A({ age: null }).age).toBeNull()
    expect(new A({}).age).toBeNull()
    expect(new A({ age: 3 }).age).toBe(3)
  })

  it('uses the field initializer as default when the schema has none', () => {
    class B extends Deneric {
      age: number | null = -1

      constructor(data?: any, strict?: boolean) {
        super({ age: ['age', Deneric.Nullable(Number)] })
        this.fromJson(data, strict)
      }
    }
    expect(new B({ age: '12' }).age).toBe(-1)
    expect(new B({ age: 'abc' }, false).age).toBe(-1)
    expect(new B({}).age).toBeNull()
  })
})

class Patch extends Deneric {
  age?: number | null
  name?: string | null
  address?: Address | null
  count?: number
  ratings: Record<string, number | null | undefined> = {}

  constructor(data?: any) {
    super({
      age: ['age', Deneric.Optional(Deneric.Nullable(Number))],
      name: ['profile.name', Deneric.Optional(Deneric.Nullable(String))],
      address: ['address', Deneric.Optional(Deneric.Nullable(Address))],
      count: ['count', Deneric.Optional(Number)],
      ratings: ['ratings', Deneric.Map(Deneric.Optional(Deneric.Nullable(Number)))],
    })
    this.fromJson(data)
  }
}

describe('Deneric.Optional', () => {
  it('distinguishes undefined (missing) from null', () => {
    const missing = new Patch({})
    expect(missing.age).toBeUndefined()
    expect(missing.name).toBeUndefined()
    expect(missing.address).toBeUndefined()

    const nulls = new Patch({ age: null, profile: { name: null }, address: null })
    expect(nulls.age).toBeNull()
    expect(nulls.name).toBeNull()
    expect(nulls.address).toBeNull()
  })

  it('keeps valid values and resolves wrong types to null', () => {
    const p = new Patch({ age: 0, profile: { name: '' }, address: { city: 'HN' } })
    expect(p.age).toBe(0)
    expect(p.name).toBe('')
    expect(p.address?.city).toBe('HN')

    expect(new Patch({ age: '12' }).age).toBeNull()
  })

  it('uses a custom default for wrong types', () => {
    class C extends Deneric {
      age?: number | null

      constructor(data?: any) {
        super({ age: ['age', Deneric.Optional(Deneric.Nullable(Number)), false, -1] })
        this.fromJson(data)
      }
    }
    expect(new C({ age: 'x' }).age).toBe(-1)
    expect(new C({ age: null }).age).toBeNull()
    expect(new C({}).age).toBeUndefined()
  })

  it('Optional without Nullable: undefined stays undefined, null falls to the type default', () => {
    expect(new Patch({}).count).toBeUndefined()
    expect(new Patch({ count: null }).count).toBe(0)
    expect(new Patch({ count: 4 }).count).toBe(4)
  })

  it('toJson omits undefined keys and keeps null', () => {
    expect(new Patch({}).toJson()).toEqual({ ratings: {} })

    const json = new Patch({ age: null, profile: { name: 'A' }, ratings: { a: 1, b: null } }).toJson()
    expect(json).toEqual({ age: null, profile: { name: 'A' }, ratings: { a: 1, b: null } })
    expect('address' in json).toBe(false)
    expect('count' in json).toBe(false)
  })

  it('toJson omits undefined Map entries', () => {
    const p = new Patch({ ratings: { a: 1 } })
    p.ratings.b = undefined
    p.ratings.c = null
    expect(p.toJson()).toEqual({ ratings: { a: 1, c: null } })
  })

  it('toJson reflects values changed after parsing', () => {
    const p = new Patch({ age: 5 })
    p.age = undefined
    p.name = null
    expect(p.toJson()).toEqual({ profile: { name: null }, ratings: {} })
  })
})

describe('zero is a value, not a missing value', () => {
  class Zero extends Deneric {
    plain: number = -1
    nullable: number | null = null
    optional?: number | null
    withDefault: number | null = null

    constructor(data?: any, strict?: boolean) {
      super({
        plain: ['plain', Number],
        nullable: ['nullable', Deneric.Nullable(Number)],
        optional: ['optional', Deneric.Optional(Deneric.Nullable(Number))],
        withDefault: ['withDefault', Deneric.Nullable(Number), false, 0],
      })
      this.fromJson(data, strict)
    }
  }
  const zeros = { plain: 0, nullable: 0, optional: 0, withDefault: 0 }

  it('keeps 0 in every wrapper (strict)', () => {
    const z = new Zero(zeros)
    expect(z).toMatchObject(zeros)
    expect(z.toJson()).toEqual(zeros)
  })

  it('keeps 0 in non-strict mode, and coerces "0" to 0', () => {
    expect(new Zero(zeros, false)).toMatchObject(zeros)
    expect(new Zero({ plain: '0', nullable: '0', optional: '0' }, false)).toMatchObject({ plain: 0, nullable: 0, optional: 0 })
  })

  it('treats "0" as a wrong type in strict mode', () => {
    expect(new Zero({ plain: '0', nullable: '0', optional: '0', withDefault: '0' })).toMatchObject({
      plain: -1,
      nullable: null,
      optional: null,
      withDefault: 0,
    })
  })

  it('applies a default of 0 only to wrong types, not to null/undefined', () => {
    expect(new Zero({ withDefault: 'x' }).withDefault).toBe(0)
    expect(new Zero({ withDefault: null }).withDefault).toBeNull()
    expect(new Zero({}).withDefault).toBeNull()
    expect(new Zero({}).toJson()).toMatchObject({ withDefault: null })
  })

  it('non-strict: empty string and false coerce to 0 (Number() semantics)', () => {
    expect(new Zero({ nullable: '' }, false).nullable).toBe(0)
    expect(new Zero({ nullable: false }, false).nullable).toBe(0)
  })

  it('keeps 0 inside Array and Map', () => {
    const p = new Profile({ scores: [0, null], ratings: { a: 0 } })
    expect(p.scores).toEqual([0, null])
    expect(p.ratings).toEqual({ a: 0 })
  })
})

describe('plain Number without any default', () => {
  class NoDefault extends Deneric {
    value!: number
    initNull: number | null = null

    constructor(data?: any, strict?: boolean) {
      super({
        value: ['value', Number],
        initNull: ['initNull', Number],
      })
      this.fromJson(data, strict)
    }
  }

  it.each([
    ['0', { value: 0 }, true, 0],
    ['5', { value: 5 }, true, 5],
    ['"0" strict', { value: '0' }, true, 0],
    ['"12" strict', { value: '12' }, true, 0],
    ['"12" non-strict', { value: '12' }, false, 12],
    ['"abc" non-strict', { value: 'abc' }, false, NaN],
    ['null', { value: null }, true, 0],
    ['missing', {}, true, 0],
  ])('%s → %s', (_, json, strict, expected) => {
    expect(new NoDefault(json, strict as boolean).value).toBe(expected)
  })

  it('falls back to 0 even when the initializer is null (known limitation, use Nullable)', () => {
    expect(new NoDefault({}).initNull).toBe(0)
  })

  it('toJson emits 0 for null/undefined values', () => {
    const n = new NoDefault({ value: 5 })
    // @ts-ignore
    n.value = null
    expect(n.toJson()).toMatchObject({ value: 0 })
  })
})

describe('README tables', () => {
  class Row extends Deneric {
    plain!: number
    nullable: number | null = null
    optional?: number | null
    zero: number | null = null

    constructor(data?: any, strict?: boolean) {
      super({
        plain: ['plain', Number],
        nullable: ['nullable', Deneric.Nullable(Number)],
        optional: ['optional', Deneric.Optional(Deneric.Nullable(Number))],
        zero: ['zero', Deneric.Nullable(Number), false, 0],
      })
      this.fromJson(data, strict)
    }
  }

  it('non-strict "abc" → NaN / null / null / default', () => {
    const r = new Row({ plain: 'abc', nullable: 'abc', optional: 'abc', zero: 'abc' }, false)
    expect(r.plain).toBeNaN()
    expect(r.nullable).toBeNull()
    expect(r.optional).toBeNull()
    expect(r.zero).toBe(0)
  })

  it('toJson for undefined field values', () => {
    const r = new Row({ plain: 1, nullable: 1, optional: 1, zero: 1 })
    // @ts-ignore
    r.plain = undefined
    r.nullable = undefined as any
    r.optional = undefined
    expect(r.toJson()).toEqual({ plain: 0, nullable: null, zero: 1 })
  })
})
