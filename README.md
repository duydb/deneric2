# deneric2
Deneric2 help you parsing data from Json Object into your Entity. 
Save your time & safety when working with json.


## Using
- define your class and extends Deneric
- define your class schema
- using fromJson method to parsing Json object to your entity
- using toJson method to transform your entity to Json Object with schema

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

## Data Types
Deneric support all common data types:
- String
- Number
- Boolean
- Object

And Deneric also support complexed type:
- Deneric.Array // Deneric.Array( <DATA_TYPE> )
- Deneric.Map // Deneric.Map( <DATA_TYPE> )
- T extends Deneric // Eg: Student

### For example:

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

## Json Ignore
You can define schema to ignore property when call method toJson

### Example
```ts
import Deneric, { DenericSchema } from 'deneric2'

class StudentIgnoreJob extends Deneric {
  fullName: string = 'noname'
  age: number = -1
  isMale: boolean = false
  roles: string[] = ['ABC', 'DEF']
  jobs: { [key: string]: string[] } = { 2021: ['Covid'] }

  private static schema: DenericSchema = {
    fullName: ['profile.full_name', String],
    age: ['profile.age', Number],
    isMale: ['others.is_male', Boolean],
    roles: ['others.roles', Deneric.Array(String)],
    jobs: ['jobs', Object, true] // json ignore. This schema will be ignore when call toJson
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