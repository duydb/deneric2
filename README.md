# deneric2
Deneric2 help you parsing data from Json Object into your Entity. 
Save your time & safety when working with json.

## Getting start
### Install
npm
```bash
npm install deneric2
```
Yarn
```bash
yarn add deneric2
```
### Using
- Define your schema & class
- using fromJson method to parsing Json object to your entity
- using toJson method to transform your entity to Json Object

### Deneric
Deneric is an abstract class. Your class must be extended from Deneric and its constructor have to set your schema in it.
| Methods        | Detail                   |
| -------------- | ------------------------ |
| clone()        | Clone instance           |
| fromJson(json) | parse json to Entity     |
| toJson()       | transform entity to Json |
#### Example
```ts
import Deneric, { DenericSchema } from 'deneric2'

const SCHEMA: DenericSchema = {} // Your schema

class MyClass extends Deneric { // Your class
    constructor(){
        super(SCHEMA)
    }
}
```

### DenericSchema
DenericSchema is a object<`key`, `value`>. `key` is `String` and `value` is a `Tuple/Array` with rule:
| DenericSchema       | Detail                                                                    |
| ------------------- | ------------------------------------------------------------------------- |
| DenericSchema.key   | key as your class proprety                                                |
| DenericSchema.value | [`dataPath`: string, `dataType`: DenericDataType, `jsonIgnore`?: boolean] |


### DenericDataType
| DataType            | Description              | Example                                      |
| ------------------- | ------------------------ | -------------------------------------------- |
| String              | string                   | ``` ['data_path', String] ```                |
| Number              | number                   | ``` ['data_path', Number] ```                |
| Boolean             | boolean                  | ``` ['data_path', Boolean] ```               |
| Array               | Array of any thing       | ``` ['data_path', Array] ```                 |
| Object              | Object                   | ``` ['data_path', Object] ```                |
| Deneric.Array       | Array of DenericDataType | ``` ['data_path', Deneric.Array(Number)] ``` |
| Deneric.Map         | Map of DenericDataType   | ``` ['data_path', Deneric.Map(MyClass)] ```  |
| Instance of Deneric | Your class               | ``` ['data_path', My Class] ```              |

Notes:
- Deneric.Array: Using to parse your search response
- Deneric.Map: Using to parse your mget response

#### Example
```ts
{
    fullName: ['profile.full_name', String],
    age: ['profile.age', Number],
    isMale: ['profile.is_male', Boolean],
    github: ['social.github', String, true] // is mean this property will be ignore when you call toJson method
}
```

### Deneric


### Using Example:

You have JSON Object like this
```ts
const json = {
  profile: {
    full_name: 'John Smith',
    age: 12
  },
  others: {
    is_male: true,
    roles: ['1', '2', '2a', '2b'],
    school_name: 'ABC School'
  },
  jobs: {
    2021: ['A', 'B', 'C'],
    2025: ['B', 'D']
  }
}
```

Define Your Class & schema
```ts
import Deneric, { DenericSchema } from 'deneric2'

class Student extends Deneric {
  fullName: string = 'noname' // default value of this property
  age: number = -1
  isMale: boolean = false
  roles: string[] = ['ABC', 'DEF']
  jobs: { [key: string]: string[] } = { 2021: ['Covid'] }

  private static schema: DenericSchema = {
    fullName: ['profile.full_name', String],
    age: ['profile.age', Number],
    isMale: ['others.is_male', Boolean],
    roles: ['others.roles', Deneric.Array(String)],
    jobs: ['jobs', Object],
  }

  constructor() {
    super(Student.schema)
  }
}

const student1 = new Student(json)
student1.fromJson(json)
```
So you have variable `student1` instance of Class `Student`.

```ts
// student1 
{
    fullName: 'John Smith',
    age: 12,
    isMale: true,
    roles: ['1', '2', '2a', '2b'],
    jobs: {
        2021: ['A', 'B', 'C'],
        2025: ['B', 'D']
    }
}
```

And have function to get json with schema from `student1` (call: `student1.toJson()`):

```ts
// student1.toJson()
{
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
    }
}
```
### Mores example:

```ts
class ClassRoom extends Deneric {
    monitor!: Student
    students!: Student[]
    mapStudents!: Record<string, Student>

    private static _schema: DenericSchema = {
        monitor: ['class_monitor', Student], // property as an Deneric Entity
        students: ['my_student', Deneric.Array(Student)], // property as an Array of Deneric Entity
        mapStudents: ['map_student', Deneric.Map(Student)] // property as an Map with value is Deneric Entity
    }

    constructor() {
        super(ClassRoom._schema)
    }
}
```

## Json Ignore Example
You can define schema to ignore property when call method toJson

```ts
import Deneric, { DenericSchema } from 'deneric2'

class StudentIgnoreJob extends Deneric {
  fullName: string = 'noname'
  jobs: { [key: string]: string[] } = {}

  private static schema: DenericSchema = {
    fullName: ['profile.full_name', String],
    jobs: ['jobs', Deneric.Map(Deneric.Array(String)), true] // json ignore. This schema will be ignore when call toJson
  }

  constructor() {
    super(StudentIgnoreJob.schema)
  }
}

const temp = new StudentIgnoreJob(json)
temp.fromJson(json)
```
So you have variable `temp` instance of Class `StudentIgnoreJob`.

```ts
// console.log(temp)
{
    fullName: 'John Smith',
    age: 12,
    isMale: true,
    roles: ['1', '2', '2a', '2b'],
    jobs: {
        2021: ['A', 'B', 'C'],
        2025: ['B', 'D']
    }
}
```
When call toJson, property jobs will be ignored.
```ts
// console.log(temp.toJson())
{
    fullName: 'John Smith',
    age: 12,
    isMale: true,
    roles: ['1', '2', '2a', '2b']
}
```