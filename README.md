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

By default, `fromJson` uses **strict mode** — values with wrong types fallback to defaults.

```ts
// Strict (default): wrong type → default value
student.fromJson({ profile: { age: '12' } })      // age → -1 (default)

// Non-strict: wrong type → coerced
student.fromJson({ profile: { age: '12' } }, false) // age → 12 (coerced to number)
```

## Migration from v1.x

The public API is **100% backward compatible**. No code changes needed in your application.

Changes under the hood:
- `lodash` is no longer bundled (zero dependencies)
- Output format changed from UMD to dual CJS + ESM
- Proper `exports` map in `package.json` for modern bundler compatibility

## License

ISC