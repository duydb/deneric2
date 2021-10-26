import { it, describe } from 'mocha'
import { expect } from 'chai'
import Deneric, { DenericSchema } from '../dist/deneric'

class Student extends Deneric {
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
      jobs: ['jobs', Deneric.Map(Deneric.Array(String))]
    })
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
  }
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

describe('fromJson', () => {
  it('checking schema instance', () => {
    const r1 = new Student(json1)
    const r2 = new Student(json1)
    // @ts-ignore
    expect(r1.__proto__.__schema__).to.be.eq(r2.__proto__.__schema__)
  })
  it('checking parse data from schema', () => {
    const r = new Student(json1)
    expect(r.full_name).to.be.eq(json1.profile.full_name)
    expect(r.age).to.be.eq(json1.profile.age)
    expect(r.is_male).to.be.eq(json1.others.is_male)
    expect(r.roles).to.be.deep.equal(json1.others.roles)
    expect(r.jobs).to.be.deep.equal(json1.jobs)
  })
  it('checking parse default value (missing schema)', () => {
    const r = new Student(json2)
    expect(r.full_name).to.be.eq('noname')
    expect(r.age).to.be.eq(-1)
    expect(r.is_male).to.be.eq(false)
    expect(r.roles).to.be.deep.equal(['100'])
    expect(r.jobs).to.be.deep.equal({ 2023: ['2023'] })
  })
  it('checking parse default value (wrong data type)', () => {
    const r = new Student(json3)
    expect(r.full_name).to.be.eq('noname')
    expect(r.age).to.be.eq(-1)
    expect(r.is_male).to.be.eq(false)
    expect(r.roles).to.be.deep.equal(['100'])
    expect(r.jobs).to.be.deep.equal({ 2023: ['2023'] })
  })
  it('checking parse complex data type (Array, Map)', () => {
    const r = new ClassRoom()
    const r2 = r.fromJson<ClassRoom>(json4)
    expect(r2.students.length).to.be.eq(json4.my_student.length)

    expect(r.students[0].full_name).to.be.eq(json1.profile.full_name)
    expect(r.students[0].age).to.be.eq(json1.profile.age)
    expect(r.students[0].is_male).to.be.eq(json1.others.is_male)
    expect(r.students[0].roles).to.be.deep.equal(json1.others.roles)
    expect(r.students[0].jobs).to.be.deep.equal(json1.jobs)

    expect(r.students[1].full_name).to.be.eq('noname')
    expect(r.students[1].age).to.be.eq(-1)
    expect(r.students[1].is_male).to.be.eq(false)
    expect(r.students[1].roles).to.be.deep.equal(['100'])
    expect(r.students[1].jobs).to.be.deep.equal({ 2023: ['2023'] })

    expect(r.students[2].full_name).to.be.eq('noname')
    expect(r.students[2].age).to.be.eq(-1)
    expect(r.students[2].is_male).to.be.eq(false)
    expect(r.students[2].roles).to.be.deep.equal(['100'])
    expect(r.students[2].jobs).to.be.deep.equal({ 2023: ['2023'] })

    expect(r.monitor.full_name).to.be.eq(json1.profile.full_name)
    expect(r.monitor.age).to.be.eq(json1.profile.age)
    expect(r.monitor.is_male).to.be.eq(json1.others.is_male)
    expect(r.monitor.roles).to.be.deep.equal(json1.others.roles)
    expect(r.monitor.jobs).to.be.deep.equal(json1.jobs)

    expect(r.mapStudents['json1'].full_name).to.be.eq(json1.profile.full_name)
    expect(r.mapStudents['json1'].age).to.be.eq(json1.profile.age)
    expect(r.mapStudents['json1'].is_male).to.be.eq(json1.others.is_male)
    expect(r.mapStudents['json1'].roles).to.be.deep.equal(json1.others.roles)
    expect(r.mapStudents['json1'].jobs).to.be.deep.equal(json1.jobs)

    expect(r.mapStudents['json2'].full_name).to.be.eq('noname')
    expect(r.mapStudents['json2'].age).to.be.eq(-1)
    expect(r.mapStudents['json2'].is_male).to.be.eq(false)
    expect(r.mapStudents['json2'].roles).to.be.deep.equal(['100'])
    expect(r.mapStudents['json2'].jobs).to.be.deep.equal({ 2023: ['2023'] })

    expect(r.mapStudents['json3'].full_name).to.be.eq('noname')
    expect(r.mapStudents['json3'].age).to.be.eq(-1)
    expect(r.mapStudents['json3'].is_male).to.be.eq(false)
    expect(r.mapStudents['json3'].roles).to.be.deep.equal(['100'])
    expect(r.mapStudents['json3'].jobs).to.be.deep.equal({ 2023: ['2023'] })
  })
})

describe('toJson test', () => {
  it('toJson default', () => {
    const r = new Student(json1)
    const json = r.toJson() as typeof json1

    expect(json.profile.full_name).to.be.eq(json1.profile.full_name)
    expect(json.profile.age).to.be.eq(json1.profile.age)
    expect(json.others.is_male).to.be.eq(json1.others.is_male)
    expect(json.others.roles).to.be.deep.equal(json1.others.roles)
    expect(json.jobs).to.be.deep.equal(json1.jobs)
  })
  it('toJson missing schema', () => {
    const r = new Student(json2)
    const json = r.toJson() as typeof json1
    expect(json.profile.full_name).to.be.eq('noname')
    expect(json.profile.age).to.be.eq(-1)
    expect(json.others.is_male).to.be.eq(false)
    expect(json.others.roles).to.be.deep.equal(['100'])
    expect(json.jobs).to.be.deep.equal({ 2023: ['2023'] })
  })
  it('toJson wrong data type', () => {
    const r = new Student(json3)
    const json = r.toJson() as typeof json1
    expect(json.profile.full_name).to.be.eq('noname')
    expect(json.profile.age).to.be.eq(-1)
    expect(json.others.is_male).to.be.eq(false)
    expect(json.others.roles).to.be.deep.equal(['100'])
    expect(json.jobs).to.be.deep.equal({ 2023: ['2023'] })
  })
  it('toJson complex data type (Array, Map)', () => {
    const r = new ClassRoom()
    r.fromJson<ClassRoom>(json4)
    const json = r.toJson() as typeof json4

    expect(json.my_student.length).to.be.eq(json4.my_student.length)

    expect((json.my_student[0] as typeof json1).profile.full_name).to.be.eq(json1.profile.full_name)
    expect((json.my_student[0] as typeof json1).profile.age).to.be.eq(json1.profile.age)
    expect((json.my_student[0] as typeof json1).others.is_male).to.be.eq(json1.others.is_male)
    expect((json.my_student[0] as typeof json1).others.roles).to.be.deep.equal(json1.others.roles)
    expect((json.my_student[0] as typeof json1).jobs).to.be.deep.equal(json1.jobs)

    expect((json.my_student[1] as typeof json1).profile.full_name).to.be.eq('noname')
    expect((json.my_student[1] as typeof json1).profile.age).to.be.eq(-1)
    expect((json.my_student[1] as typeof json1).others.is_male).to.be.eq(false)
    expect((json.my_student[1] as typeof json1).others.roles).to.be.deep.equal(['100'])
    expect((json.my_student[1] as typeof json1).jobs).to.be.deep.equal({ 2023: ['2023'] })

    expect((json.my_student[2] as typeof json1).profile.full_name).to.be.eq('noname')
    expect((json.my_student[2] as typeof json1).profile.age).to.be.eq(-1)
    expect((json.my_student[2] as typeof json1).others.is_male).to.be.eq(false)
    expect((json.my_student[2] as typeof json1).others.roles).to.be.deep.equal(['100'])
    expect((json.my_student[2] as typeof json1).jobs).to.be.deep.equal({ 2023: ['2023'] })

    expect(json.class_monitor.profile.full_name).to.be.eq(json1.profile.full_name)
    expect(json.class_monitor.profile.age).to.be.eq(json1.profile.age)
    expect(json.class_monitor.others.is_male).to.be.eq(json1.others.is_male)
    expect(json.class_monitor.others.roles).to.be.deep.equal(json1.others.roles)
    expect(json.class_monitor.jobs).to.be.deep.equal(json1.jobs)

    expect((json.map_student['json1'] as typeof json1).profile.full_name).to.be.eq(json1.profile.full_name)
    expect((json.map_student['json1'] as typeof json1).profile.age).to.be.eq(json1.profile.age)
    expect((json.map_student['json1'] as typeof json1).others.is_male).to.be.eq(json1.others.is_male)
    expect((json.map_student['json1'] as typeof json1).others.roles).to.be.deep.equal(json1.others.roles)
    expect((json.map_student['json1'] as typeof json1).jobs).to.be.deep.equal(json1.jobs)

    expect((json.map_student['json2'] as unknown as typeof json1).profile.full_name).to.be.eq('noname')
    expect((json.map_student['json2'] as unknown as typeof json1).profile.age).to.be.eq(-1)
    expect((json.map_student['json2'] as unknown as typeof json1).others.is_male).to.be.eq(false)
    expect((json.map_student['json2'] as unknown as typeof json1).others.roles).to.be.deep.equal(['100'])
    expect((json.map_student['json2'] as unknown as typeof json1).jobs).to.be.deep.equal({ 2023: ['2023'] })

    expect((json.map_student['json3'] as unknown as typeof json1).profile.full_name).to.be.eq('noname')
    expect((json.map_student['json3'] as unknown as typeof json1).profile.age).to.be.eq(-1)
    expect((json.map_student['json3'] as unknown as typeof json1).others.is_male).to.be.eq(false)
    expect((json.map_student['json3'] as unknown as typeof json1).others.roles).to.be.deep.equal(['100'])
    expect((json.map_student['json3'] as unknown as typeof json1).jobs).to.be.deep.equal({ 2023: ['2023'] })
  })
})

describe('jsonIgnore test', () => {
  it('default', () => {
    const r = new StudentIgnoreJob(json1)
    const json = r.toJson() as typeof json1

    expect(r.full_name).to.be.eq(json1.profile.full_name)
    expect(r.age).to.be.eq(json1.profile.age)
    expect(r.is_male).to.be.eq(json1.others.is_male)
    expect(r.roles).to.be.deep.equal(json1.others.roles)
    expect(r.jobs).to.be.deep.equal(json1.jobs)

    expect(json.profile.full_name).to.be.eq(json1.profile.full_name)
    expect(json.profile.age).to.be.eq(json1.profile.age)
    expect(json.others.is_male).to.be.eq(json1.others.is_male)
    expect(json.others.roles).to.be.deep.equal(json1.others.roles)
    expect(json.jobs).to.be.deep.equal(undefined)
  })
})

describe('Throw Error when Invalid Schema', () => {
  it('default', () => {
    expect(() => {
      new InvalidStudent()
    }).to.be.throw(TypeError, 'Invalid schema: InvalidStudent')
  })
})