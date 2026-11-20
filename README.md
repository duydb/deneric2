# deneric2

> Zero-dependency JSON-to-Entity parser with schema support.  
> Safe, typed, and works with all modern bundlers (Vite, Webpack, Rollup, esbuild).

## ✨ What's New in v2.0.0

- **Zero dependencies** — no more lodash, bundle size reduced from 23KB to ~7KB
- **Dual CJS/ESM output** — works seamlessly with Vite, Webpack, Rollup, and Node.js
- **Modern TypeScript** — full type declarations for both ESM and CJS consumers

## Getting Started

### Install
```bash
npm install deneric2
```
```bash
yarn add deneric2
```

### Basic Usage
1. Define your schema & class (extend from `Deneric`)
2. Use `fromJson(data)` to parse a JSON object into your entity
3. Use `toJson()` to transform your entity back to a JSON object

## API Reference

### Deneric

`Deneric` is an abstract class. Your class must extend it and pass a schema to `super()`.

| Method         | Description              |
| -------------- | ------------------------ |
| `clone()`      | Deep clone the instance  |
| `fromJson(json, strict?)` | Parse JSON into entity (strict mode by default) |
| `toJson()`     | Transform entity to JSON |

#### Example
```ts
import Deneric from 'deneric2'
import type { DenericSchema } from 'deneric2'

const SCHEMA: DenericSchema = {
  fullName: ['profile.full_name', String],
  age: ['profile.age', Number],
}

class User extends Deneric {
  fullName: string = ''
  age: number = 0

  constructor(data?: any) {
    super(SCHEMA)
    this.fromJson(data)
  }
}
```

### DenericSchema

Schema is an object where each key maps to a tuple: `[dataPath, dataType, jsonIgnore?, defaultValue?]`

| Field           | Type             | Description                                    |
| --------------- | ---------------- | ---------------------------------------------- |
| `dataPath`      | `string`         | Dot-notation path to the value in JSON          |
| `dataType`      | `DenericDataType`| The expected data type                          |
| `jsonIgnore`    | `boolean?`       | If `true`, skip this field in `toJson()` output |
| `defaultValue`  | `any?`           | Custom default value                            |

### DenericDataType

| DataType            | Description              | Example                                      |
| ------------------- | ------------------------ | -------------------------------------------- |
| `String`            | string                   | `['path', String]`                           |
| `Number`            | number                   | `['path', Number]`                           |
| `Boolean`           | boolean                  | `['path', Boolean]`                          |
| `Array`             | Array of anything        | `['path', Array]`                            |
| `Object`            | Plain object             | `['path', Object]`                           |
| `Deneric.Array(T)`  | Typed array              | `['path', Deneric.Array(Number)]`            |
| `Deneric.Map(T)`    | Map (Record) of type T   | `['path', Deneric.Map(MyClass)]`             |
| `Deneric.Nullable(T)` | `T` or `null`          | `['path', Deneric.Nullable(Number)]`         |
| `Deneric.Optional(T)` | `T` or `undefined` (omitted in `toJson()`) | `['path', Deneric.Optional(Deneric.Nullable(Number))]` |
| Deneric subclass     | Nested entity            | `['path', MyClass]`                          |

## Full Example

Given this JSON:
```ts
const json = {
  profile: {
    full_name: 'John Smith',
    age: 12
  },
  others: {
    is_male: true,
    roles: ['admin', 'user']
  },
  jobs: {
    2021: ['Dev', 'Lead'],
    2025: ['CTO']
  }
}
```

Define your entity:
```ts
import Deneric from 'deneric2'

class Student extends Deneric {
  fullName: string = 'noname'
  age: number = -1
  isMale: boolean = false
  roles: string[] = []
  jobs: Record<string, string[]> = {}

  constructor(data?: any) {
    super({
      fullName: ['profile.full_name', String],
      age: ['profile.age', Number],
      isMale: ['others.is_male', Boolean],
      roles: ['others.roles', Deneric.Array(String)],
      jobs: ['jobs', Object],
    })
    this.fromJson(data)
  }
}

const student = new Student(json)
// student.fullName → 'John Smith'
// student.age → 12
// student.roles → ['admin', 'user']

student.toJson()
// → { profile: { full_name: 'John Smith', age: 12 }, others: { is_male: true, roles: ['admin', 'user'] }, jobs: { ... } }
```

### Nested Entities
```ts
class ClassRoom extends Deneric {
  monitor!: Student
  students!: Student[]
  mapStudents!: Record<string, Student>

  constructor() {
    super({
      monitor: ['class_monitor', Student],
      students: ['my_student', Deneric.Array(Student)],
      mapStudents: ['map_student', Deneric.Map(Student)]
    })
  }
}
```

### JSON Ignore
```ts
class StudentIgnoreJob extends Deneric {
  fullName: string = 'noname'
  jobs: Record<string, string[]> = {}

  constructor(data?: any) {
    super({
      fullName: ['profile.full_name', String],
      jobs: ['jobs', Deneric.Map(Deneric.Array(String)), true] // ignored in toJson()
    })
    this.fromJson(data)
  }
}

const temp = new StudentIgnoreJob(json)
temp.toJson()
// → { profile: { full_name: 'John Smith' } }
// 'jobs' is excluded from output
```

### Strict vs Non-Strict Mode

`strict` is the second argument of `fromJson(data, strict = true)` and is chosen per call — there is no
per-field or global setting.

| Mode                 | Valid type | Wrong type                                                  |
| -------------------- | ---------- | ----------------------------------------------------------- |
| strict (`true`)      | kept       | field default (`Nullable` → `null` or its declared default) |
| non-strict (`false`) | kept       | coerced with `Number()`, `String()`, `Boolean()`, …         |

`null` / `undefined` are never coerced in either mode: they follow the default or the wrapper.

```ts
class User extends Deneric {
  age: number = -1

  constructor(data?: any, strict = true) {
    super({ age: ['profile.age', Number] })
    this.fromJson(data, strict)
  }
}

new User({ profile: { age: '12' } })        // age → -1 (strict: wrong type → default)
new User({ profile: { age: '12' } }, false) // age → 12 (non-strict: coerced)
```

`strict` is passed down to `Deneric.Array` / `Deneric.Map` items, but **not** to nested entities:
a nested class is built with `new Child(data)`, so its own constructor decides the mode.

### Null Handling

By default, a missing or `null` value falls back to the field default, and a field without one falls back
to the type default (`Number` → `0`, `String` → `''`, …). When `0` and "no data" must stay distinguishable,
wrap the type:

| Wrapper                 | `null`         | missing (`undefined`) | TS type                  |
| ----------------------- | -------------- | --------------------- | ------------------------ |
| `Deneric.Nullable(T)`   | `null`         | `null`                | `T \| null`              |
| `Deneric.Optional(T)`   | handled by `T` | `undefined`           | `T \| undefined`         |
| `Optional(Nullable(T))` | `null`         | `undefined`           | `T \| null \| undefined` |

```ts
class Product extends Deneric {
  price: number | null = null
  discount?: number | null
  variants: (number | null)[] = []
  owner: User | null = null

  constructor(data?: any) {
    super({
      price: ['price', Deneric.Nullable(Number)],
      discount: ['discount', Deneric.Optional(Deneric.Nullable(Number))],
      variants: ['variants', Deneric.Array(Deneric.Nullable(Number))],
      owner: ['owner', Deneric.Nullable(User)],
    })
    this.fromJson(data)
  }
}

new Product({}).price                          // → null (not 0)
new Product({}).discount                       // → undefined
new Product({ discount: null }).discount       // → null
new Product({ price: 0 }).price                // → 0
new Product({ variants: [1, null] }).variants  // → [1, null]
new Product({}).toJson()                       // → { price: null, variants: [], owner: null }
```

#### Evaluation order

Wrappers apply outside-in. `Optional` runs first and returns `undefined` straight away, so `Nullable`
never sees it and cannot turn it into `null`:

```
Optional(Nullable(Number))

data ──► Optional: data === undefined ? ──yes──► undefined   (stops here)
                         │ no
                         ▼
         Nullable: data === null ? ──yes──► null
                         │ no
                         ▼
         Number (strict): typeof === 'number' ? ──yes──► data
                                        │ no
                                        ▼
                                      null   (Nullable uses null as default)
```

`Optional(T)` alone only handles `undefined`; `null` goes to `T` (`Optional(Number)` turns `null` into `0`).
Inside `Deneric.Array`, use `Nullable` — JSON arrays cannot hold `undefined`.

#### Custom default for wrong types

For `Nullable`, the default only applies to wrong types (strict) and `NaN` (non-strict) — `null` and
missing keep their meaning. Resolution order: schema slot 4 → field initializer → `null`.

```ts
age: ['age', Deneric.Nullable(Number), false, -1]   // 1. schema default
age: number | null = -1                              // 2. field initializer (no schema default)
age: number | null = null                            // 3. nothing set → null
```

#### Results by type

| JSON                 | `Number` (no default) | `Number` (default `-1`) | `Nullable(Number)` | `Optional(Nullable(Number))` | `Nullable(Number)` + default `0` |
| -------------------- | --------------------- | ----------------------- | ------------------ | ---------------------------- | -------------------------------- |
| `0`                  | `0`                   | `0`                     | `0`                | `0`                          | `0`                              |
| `5`                  | `5`                   | `5`                     | `5`                | `5`                          | `5`                              |
| `'0'` (strict)       | `0`                   | `-1`                    | `null`             | `null`                       | `0` (wrong type → default)       |
| `'0'` (non-strict)   | `0`                   | `0`                     | `0`                | `0`                          | `0`                              |
| `'abc'` (non-strict) | `NaN`                 | `NaN`                   | `null`             | `null`                       | `0`                              |
| `null`               | `0`                   | `-1`                    | `null`             | `null`                       | `null`                           |
| missing              | `0`                   | `-1`                    | `null`             | `undefined`                  | `null`                           |

`0` is a value, never "missing": it is kept by every wrapper and emitted as `0` by `toJson()`.
In non-strict mode `''` and `false` coerce to `0` (`Number()` semantics), also under `Nullable`.

#### `toJson()`

| Field value | `Number` (no default) | `Nullable(Number)` | `Optional(Nullable(Number))` |
| ----------- | --------------------- | ------------------ | ---------------------------- |
| `0`         | `{ age: 0 }`          | `{ age: 0 }`       | `{ age: 0 }`                 |
| `null`      | `{ age: 0 }`          | `{ age: null }`    | `{ age: null }`              |
| `undefined` | `{ age: 0 }`          | `{ age: null }`    | `{}` (key omitted)           |

Omitting `undefined` Optional fields (and Map entries) suits PATCH payloads: missing means
"leave unchanged", `null` means "clear".

Keep display fallbacks such as `-` or `N/A` in the view layer (`price ?? '-'`), not as a schema default —
a string default on a `Number` field breaks arithmetic and is sent back to the API by `toJson()`.

An explicit `null` default in the schema (`['age', Number, false, null]`) is respected. A field initializer
of `null` on a plain `Number` still falls back to `0` — use `Nullable(Number)` instead.

## Migration from v1.x

The public API is **100% backward compatible**. No code changes needed in your application.

Changes under the hood:
- `lodash` is no longer bundled (zero dependencies)
- Output format changed from UMD to dual CJS + ESM
- Proper `exports` map in `package.json` for modern bundler compatibility

## License

ISC