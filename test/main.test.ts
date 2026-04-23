import { it, describe, expect } from 'vitest'
import Deneric, { DenericSchema } from '../src/Deneric'

const STUDENT_SCHEMA: DenericSchema = {
  full_name: ['profile.full_name', String],
  age: ['profile.age', Number],
  is_male: ['others.is_male', Boolean],
  roles: ['others.roles', Deneric.Array(String)],
  jobs: ['jobs', Deneric.Map(Deneric.Array(String))],
  highscores: ['highscores', Deneric.Array(Number)]
}

class Student extends Deneric {
  full_name: string = 'noname'
  age: number = -1
  is_male: boolean = false
  roles: (string | number)[] = ['100']
  jobs: { [key: string]: string[] } = { 2023: ['2023'] }
  highscores!: number[]

  constructor(data: any) {
    super(STUDENT_SCHEMA)
    this.fromJson(data)
  }
}

class StudentIgnoreJob extends Deneric {
  full_name: string = 'noname'
  age: number = -1
  is_male: boolean = false
  roles: (string | number)[] = ['100']
  jobs: { [key: string]: string[] } = { 2023: ['2023'] }

  constructor(data: any) {
    super({
      full_name: ['profile.full_name', String],
      age: ['profile.age', Number],
      is_male: ['others.is_male', Boolean],
      roles: ['others.roles', Deneric.Array(String)],
      jobs: ['jobs', Object, true],
    })
    this.fromJson(data)
  }
}


class ClassRoom extends Deneric {
  monitor: Student = new Student({})
  students: Student[] = []
  mapStudents: Record<string, Student> = {}

  constructor() {
    super({
      monitor: ['class_monitor', Student],
      students: ['my_student', Deneric.Array(Student)],
      mapStudents: ['map_student', Deneric.Map(Student)]
    })
  }
}

class InvalidStudent extends Deneric {
  constructor() {
    super(null as unknown as DenericSchema);
  }
}

class NoStrictClass extends Deneric {
  number!: number
  string!: string
  boolean!: boolean
  object!: object
  array!: string[]

  constructor() {
    super({
      number: ['number', Number],
      string: ['string', String],
      boolean: ['boolean', Boolean],
      object: ['object', Object],
      array: ['array', Array]
    })
  }
}

class ArrayNumber extends Deneric {
  numbers!: number[]

  constructor(data?: object) {
    super({
      numbers: ['', Deneric.Array(Number)]
    })
    this.fromJson(data)
  }
}

const json1 = {
  profile: {
    full_name: 'John Smith',
    age: 12
  },
  others: {
    is_male: true,
    roles: ['1', '2', '2a', '2b']
  },
  jobs: {
    2021: ['A', 'B', 'C'],
    2025: ['B', 'D']
  },
  highscores: [10, 9.5, 8.75]
}

const json2 = null


const json3 = {
  profile: {
    full_name: 1,
    age: '12a'
  },
  others: {
    is_male: 5,
    roles: 'ABCDE'
  },
  jobs: true
}

const json4 = {
  my_student: [json1, json2, json3],
  class_monitor: json1,
  map_student: {
    json1,
    json2,
    json3
  }
}

const noStrictJson = {
  number: '123',
  string: 21,
  boolean: 'Not a Boolean',
  object: true,
  array: 'Not an Array'
}

describe('fromJson', () => {
  it('checking schema instance', () => {
    const r1 = new Student(json1)
    const r2 = new Student(json1)
    expect(Deneric.Utils.getSchema(r1)).toBe(Deneric.Utils.getSchema(r2))
    expect(Deneric.Utils.getSchema(r1)).toBe(STUDENT_SCHEMA)
  })
  it('checking parse data from schema', () => {
    const r = new Student(json1)
    expect(r.full_name).toBe(json1.profile.full_name)
    expect(r.age).toBe(json1.profile.age)
    expect(r.is_male).toBe(json1.others.is_male)
    expect(r.roles).toEqual(json1.others.roles)
    expect(r.jobs).toEqual(json1.jobs)
    expect(r.highscores).toEqual(json1.highscores)
  })
  it('checking parse default value (missing schema)', () => {
    const r = new Student(null)
    expect(r.full_name).toBe('noname')
    expect(r.age).toBe(-1)
    expect(r.is_male).toBe(false)
    expect(r.roles).toEqual(['100'])
    expect(r.jobs).toEqual({ 2023: ['2023'] })
    expect(r.highscores).toEqual([])

    r.highscores = [1]

    const r2 = r.clone<Student>()
    expect(r2.highscores).toEqual(r.highscores)
  })
  it('checking parse default value (wrong data type)', () => {
    const r = new Student(json3)
    expect(r.full_name).toBe('noname')
    expect(r.age).toBe(-1)
    expect(r.is_male).toBe(false)
    expect(r.roles).toEqual(['100'])
    expect(r.jobs).toEqual({ 2023: ['2023'] })
    expect(r.highscores).toEqual([])
  })
  it('checking default value when call fromJson', () => {
    const r = new Student(json1)
    expect(r.full_name).toBe(json1.profile.full_name)
    expect(r.age).toBe(json1.profile.age)
    expect(r.is_male).toBe(json1.others.is_male)
    expect(r.roles).toEqual(json1.others.roles)
    expect(r.jobs).toEqual(json1.jobs)

    r.fromJson(json3)
    expect(r.full_name).toBe('noname')
    expect(r.age).toBe(-1)
    expect(r.is_male).toBe(false)
    expect(r.roles).toEqual(['100'])
    expect(r.jobs).toEqual({ 2023: ['2023'] })
  })
  it('checking parse complex data type (Array, Map)', () => {
    const r = new ClassRoom()
    const r2 = r.fromJson<ClassRoom>(json4)
    expect(r2.students.length).toBe(json4.my_student.length)

    expect(r.students[0].full_name).toBe(json1.profile.full_name)
    expect(r.students[0].age).toBe(json1.profile.age)
    expect(r.students[0].is_male).toBe(json1.others.is_male)
    expect(r.students[0].roles).toEqual(json1.others.roles)
    expect(r.students[0].jobs).toEqual(json1.jobs)

    expect(r.students[1].full_name).toBe('noname')
    expect(r.students[1].age).toBe(-1)
    expect(r.students[1].is_male).toBe(false)
    expect(r.students[1].roles).toEqual(['100'])
    expect(r.students[1].jobs).toEqual({ 2023: ['2023'] })

    expect(r.students[2].full_name).toBe('noname')
    expect(r.students[2].age).toBe(-1)
    expect(r.students[2].is_male).toBe(false)
    expect(r.students[2].roles).toEqual(['100'])
    expect(r.students[2].jobs).toEqual({ 2023: ['2023'] })

    expect(r.monitor.full_name).toBe(json1.profile.full_name)
    expect(r.monitor.age).toBe(json1.profile.age)
    expect(r.monitor.is_male).toBe(json1.others.is_male)
    expect(r.monitor.roles).toEqual(json1.others.roles)
    expect(r.monitor.jobs).toEqual(json1.jobs)

    expect(r.mapStudents['json1'].full_name).toBe(json1.profile.full_name)
    expect(r.mapStudents['json1'].age).toBe(json1.profile.age)
    expect(r.mapStudents['json1'].is_male).toBe(json1.others.is_male)
    expect(r.mapStudents['json1'].roles).toEqual(json1.others.roles)
    expect(r.mapStudents['json1'].jobs).toEqual(json1.jobs)

    expect(r.mapStudents['json2'].full_name).toBe('noname')
    expect(r.mapStudents['json2'].age).toBe(-1)
    expect(r.mapStudents['json2'].is_male).toBe(false)
    expect(r.mapStudents['json2'].roles).toEqual(['100'])
    expect(r.mapStudents['json2'].jobs).toEqual({ 2023: ['2023'] })

    expect(r.mapStudents['json3'].full_name).toBe('noname')
    expect(r.mapStudents['json3'].age).toBe(-1)
    expect(r.mapStudents['json3'].is_male).toBe(false)
    expect(r.mapStudents['json3'].roles).toEqual(['100'])
    expect(r.mapStudents['json3'].jobs).toEqual({ 2023: ['2023'] })
  })
})

describe('toJson test', () => {
  it('toJson default', () => {
    const r = new Student(json1)
    const json = r.toJson() as typeof json1

    expect(json.profile.full_name).toBe(json1.profile.full_name)
    expect(json.profile.age).toBe(json1.profile.age)
    expect(json.others.is_male).toBe(json1.others.is_male)
    expect(json.others.roles).toEqual(json1.others.roles)
    expect(json.jobs).toEqual(json1.jobs)
  })
  it('toJson missing schema', () => {
    const r = new Student(json2)
    const json = r.toJson() as typeof json1
    expect(json.profile.full_name).toBe('noname')
    expect(json.profile.age).toBe(-1)
    expect(json.others.is_male).toBe(false)
    expect(json.others.roles).toEqual(['100'])
    expect(json.jobs).toEqual({ 2023: ['2023'] })
  })
  it('toJson wrong data type', () => {
    const r = new Student(json3)
    const json = r.toJson() as typeof json1
    expect(json.profile.full_name).toBe('noname')
    expect(json.profile.age).toBe(-1)
    expect(json.others.is_male).toBe(false)
    expect(json.others.roles).toEqual(['100'])
    expect(json.jobs).toEqual({ 2023: ['2023'] })
  })
  it('toJson with valid default value', () => {
    const n = new NoStrictClass()
    n.fromJson(noStrictJson, false)

    expect(typeof n.number === 'number').toBe(true)
    expect(typeof n.string === 'string').toBe(true)
    expect(typeof n.boolean === 'boolean').toBe(true)
    expect(Array.isArray(n.array)).toBe(true)
    expect(typeof n.object === 'object').toBe(true)

    let r: { number?: number, string?: string, boolean?: boolean, array?: string[], object?: object } = n.toJson()
    expect(typeof r.number === 'number').toBe(true)
    expect(typeof r.string === 'string').toBe(true)
    expect(typeof r.boolean === 'boolean').toBe(true)
    expect(Array.isArray(r.array)).toBe(true)
    expect(typeof r.object === 'object').toBe(true)

    // @ts-ignore
    n.number = undefined
    // @ts-ignore
    n.string = undefined
    // @ts-ignore
    n.boolean = undefined
    // @ts-ignore
    n.array = undefined
    // @ts-ignore
    n.object = undefined

    r = n.toJson()
    expect(typeof r.number === 'number').toBe(true)
    expect(typeof r.string === 'string').toBe(true)
    expect(typeof r.boolean === 'boolean').toBe(true)
    expect(Array.isArray(r.array)).toBe(true)
    expect(typeof r.object === 'object').toBe(true)
  })
  it('toJson complex data type (Array, Map)', () => {
    const r = new ClassRoom()
    r.fromJson<ClassRoom>(json4)
    const json = r.toJson() as typeof json4

    expect(json.my_student.length).toBe(json4.my_student.length)
    expect((json.my_student[0] as typeof json1).profile.full_name).toBe(json1.profile.full_name)
    expect((json.my_student[0] as typeof json1).profile.age).toBe(json1.profile.age)
    expect((json.my_student[0] as typeof json1).others.is_male).toBe(json1.others.is_male)
    expect((json.my_student[0] as typeof json1).others.roles).toEqual(json1.others.roles)
    expect((json.my_student[0] as typeof json1).jobs).toEqual(json1.jobs)

    expect((json.my_student[1] as typeof json1).profile.full_name).toBe('noname')
    expect((json.my_student[1] as typeof json1).profile.age).toBe(-1)
    expect((json.my_student[1] as typeof json1).others.is_male).toBe(false)
    expect((json.my_student[1] as typeof json1).others.roles).toEqual(['100'])
    expect((json.my_student[1] as typeof json1).jobs).toEqual({ 2023: ['2023'] })

    expect((json.my_student[2] as typeof json1).profile.full_name).toBe('noname')
    expect((json.my_student[2] as typeof json1).profile.age).toBe(-1)
    expect((json.my_student[2] as typeof json1).others.is_male).toBe(false)
    expect((json.my_student[2] as typeof json1).others.roles).toEqual(['100'])
    expect((json.my_student[2] as typeof json1).jobs).toEqual({ 2023: ['2023'] })

    expect(json.class_monitor.profile.full_name).toBe(json1.profile.full_name)
    expect(json.class_monitor.profile.age).toBe(json1.profile.age)
    expect(json.class_monitor.others.is_male).toBe(json1.others.is_male)
    expect(json.class_monitor.others.roles).toEqual(json1.others.roles)
    expect(json.class_monitor.jobs).toEqual(json1.jobs)

    expect((json.map_student['json1'] as typeof json1).profile.full_name).toBe(json1.profile.full_name)
    expect((json.map_student['json1'] as typeof json1).profile.age).toBe(json1.profile.age)
    expect((json.map_student['json1'] as typeof json1).others.is_male).toBe(json1.others.is_male)
    expect((json.map_student['json1'] as typeof json1).others.roles).toEqual(json1.others.roles)
    expect((json.map_student['json1'] as typeof json1).jobs).toEqual(json1.jobs)

    expect((json.map_student['json2'] as unknown as typeof json1).profile.full_name).toBe('noname')
    expect((json.map_student['json2'] as unknown as typeof json1).profile.age).toBe(-1)
    expect((json.map_student['json2'] as unknown as typeof json1).others.is_male).toBe(false)
    expect((json.map_student['json2'] as unknown as typeof json1).others.roles).toEqual(['100'])
    expect((json.map_student['json2'] as unknown as typeof json1).jobs).toEqual({ 2023: ['2023'] })

    expect((json.map_student['json3'] as unknown as typeof json1).profile.full_name).toBe('noname')
    expect((json.map_student['json3'] as unknown as typeof json1).profile.age).toBe(-1)
    expect((json.map_student['json3'] as unknown as typeof json1).others.is_male).toBe(false)
    expect((json.map_student['json3'] as unknown as typeof json1).others.roles).toEqual(['100'])
    expect((json.map_student['json3'] as unknown as typeof json1).jobs).toEqual({ 2023: ['2023'] })
  })
  it('toJson must equal clone.toJson', () => {
    const r = new Student(json1)
    const json = r.toJson() as typeof json1
    const jsonClone = r.clone().toJson() as typeof json1

    expect(json).toEqual(jsonClone)

    const r2 = new ClassRoom()
    r2.fromJson<ClassRoom>(json4)
    const json2 = r2.toJson() as typeof json4
    const json2Clone = r2.clone().toJson() as typeof json4
    expect(json2).toEqual(json2Clone)
  })
})

describe('jsonIgnore test', () => {
  it('must be ignore json when call toJson func', () => {
    const r = new StudentIgnoreJob(json1)
    const json = r.toJson() as typeof json1

    expect(r.full_name).toBe(json1.profile.full_name)
    expect(r.age).toBe(json1.profile.age)
    expect(r.is_male).toBe(json1.others.is_male)
    expect(r.roles).toEqual(json1.others.roles)
    expect(r.jobs).toEqual(json1.jobs)

    expect(json.profile.full_name).toBe(json1.profile.full_name)
    expect(json.profile.age).toBe(json1.profile.age)
    expect(json.others.is_male).toBe(json1.others.is_male)
    expect(json.others.roles).toEqual(json1.others.roles)
    expect(json.jobs).toBeUndefined()
  })
})

describe('Throw Error when Invalid Schema', () => {
  it('must be throw an error when using invalid schema', () => {
    expect(() => {
      new InvalidStudent()
    }).toThrow(TypeError)
  })
})

describe('Common dataType and strict mode', () => {
  it('must be parse data to match dataType with no-strict rule', () => {
    const n = new NoStrictClass()
    n.fromJson(noStrictJson, false)

    expect(typeof n.number === 'number').toBe(true)
    expect(typeof n.string === 'string').toBe(true)
    expect(typeof n.boolean === 'boolean').toBe(true)
    expect(Array.isArray(n.array)).toBe(true)
    expect(typeof n.object === 'object').toBe(true)

    expect(n.number).toBe(Number(noStrictJson.number))
    expect(n.string).toBe(String(noStrictJson.string))
    expect(n.boolean).toBe(Boolean(noStrictJson.boolean))
    expect(n.array).toEqual(Array(noStrictJson.array))
    expect(n.object).toEqual(Object(noStrictJson.object))
  })

  it('must be parse to default value with strict rule', () => {
    const n = new NoStrictClass()
    n.fromJson(noStrictJson)

    expect(typeof n.number === 'number').toBe(true)
    expect(typeof n.string === 'string').toBe(true)
    expect(typeof n.boolean === 'boolean').toBe(true)
    expect(Array.isArray(n.array)).toBe(true)
    expect(typeof n.object === 'object').toBe(true)

    expect(n.number).toBe(0)
    expect(n.string).toBe('')
    expect(n.boolean).toBe(false)
    expect(n.array).toEqual([])
    expect(n.object).toEqual({})
  })
})

describe('Empty DataPath', () => {
  it('ArrayNumber', () => {
    const r = new ArrayNumber();
    expect(r.numbers).toEqual([])

    const json = [1,2,3]
    r.fromJson(json)
    expect(r.numbers).toEqual(json)

    const json2 = [3,5,7]
    const r2 = new ArrayNumber(json2);
    expect(r2.numbers).toEqual(json2)
  })
})

const compositeJson = {
  name: 'parent',
  children: [{
    name: 'child_1'
  },{
    name: 'child_2'
  },{
    name: 'child_3',
    children: [{
      name: 'child_3_1',
    },{
      name: 'child_3_2'
    }]
  }]
}

class CompositeItem extends Deneric {
  name: string = ''
  children!: CompositeItem[]

  constructor(json?: object) {
    super({
      name: ['name', String],
      children: ['children', Deneric.Array(CompositeItem)]
    })
    this.fromJson(json)
  }
}

describe('Composite', () => {
  it('must be success when parse composite item', () => {
    const r = new CompositeItem(compositeJson)

    expect(r.name).toBe('parent')
    expect(r.children.length).toBe(3)
    expect(r.children[0].name).toBe('child_1')
    expect(r.children[2].name).toBe('child_3')
    expect(r.children[2].children.length).toBe(2)
    expect(r.children[2].children[0].name).toBe('child_3_1')
  })
})