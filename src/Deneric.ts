import get from 'lodash/get';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import isObject from 'lodash/isObject';

export type SingleType = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor | Deneric | typeof Deneric
export type TDataType = SingleType | ComplexDataType
export type DenericSchema = { [key: string]: [dataPath: string, dataType: TDataType] }
type Newable = { new(value?: any): Deneric; prototype: Deneric }

function getDefaultValue(dataType: TDataType) {
  switch (dataType) {
    case String:
      return ''
    case Number:
      return 0
    case Boolean:
      return false
    case Array:
      return []
    case Object:
      return {}
  }
  return undefined;
}


abstract class ComplexDataType {
  abstract itemType: SingleType

  isArray: boolean = false
  isMap: boolean = false
}

// class StringDataType extends DenericDataType {
//   type = String
// }

// class NumberDataType extends DenericDataType {
//   type = Number
// }

// class BooleanDataType extends DenericDataType {
//   type = Boolean
// }

class ArrayDataType extends ComplexDataType {
  isArray = true
  constructor(public itemType: SingleType) {
    super()
  }
}

class MapDataType extends ComplexDataType {
  isMap = true
  constructor(public itemType: SingleType) {
    super()
  }
}

// class InstanceDataType extends DenericDataType {
//   type = Object
//   constructor(public valueType: typeof Deneric) {
//     super()
//   }
// }


const Utils = Object.freeze({
  transformData(data: any, dataType: TDataType, defaultValue: any): any {
    switch (dataType) {
      case String:
        return typeof data === 'string' ? data : defaultValue
      case Number:
        return typeof data === 'number' ? data : defaultValue
      case Boolean:
        return typeof data === 'boolean' ? data : defaultValue
      case Array:
        return Array.isArray(data) ? data : defaultValue
      case Object:
        return isObject(data) ? data : defaultValue
    }
    console.log('NOT MATCH COMMON TYPES', dataType)
    if (dataType instanceof ComplexDataType) {
      const complexDataType = dataType as ComplexDataType
      if (complexDataType.isArray) {
        console.log('isArray')
        console.log({
          data,
          itemType: complexDataType.itemType
        })
        return Array.isArray(data) ? data.map(item => Utils.transformData(item, complexDataType.itemType, Utils.getDefaultValue(complexDataType.itemType))) : defaultValue
      }
      if (complexDataType.isMap) {
        console.log('isMap')
        console.log({
          data,
          itemType: complexDataType.itemType
        })
        data = isObject(data) ? data : {}
        return Object.keys(data).reduce((prev, key) => {
          set(prev, key, Utils.transformData(data[key], complexDataType.itemType, Utils.getDefaultValue(complexDataType.itemType)))
          return prev
        }, {})
      }
    }
    // const isComplexDataType = dataType instanceof ComplexDataType
    // if (isComplexDataType && (dataType as ComplexDataType).isArray) {
    //   console.log('HERE')
    //   console.log({
    //     dataType: dataType[0],
    //     instanceof: dataType[0].prototype instanceof Deneric,
    //     instance: new (dataType[0] as unknown as Newable)()
    //   })
    // }

    // if (Array.isArray(dataType) && dataType[0].prototype instanceof Deneric) {
    //   console.log('HERE')
    //   console.log({
    //     dataType: dataType[0],
    //     instanceof: dataType[0].prototype instanceof Deneric,
    //     instance: new (dataType[0] as unknown as Newable)()
    //   })
    //   return Array.isArray(data) ? data.map(item => new (dataType[0] as unknown as Newable)(item)) : defaultValue
    // }

    if ((dataType as typeof Deneric).prototype instanceof Deneric) {
      return new (dataType as unknown as Newable)(data)
    }

    return data;
  },
  getDefaultValue(dataType: TDataType) {
    switch (dataType) {
      case String:
        return ''
      case Number:
        return 0
      case Boolean:
        return false
      case Array:
        return []
      case Object:
        return {}
    }
    return undefined;
  }
})

abstract class Deneric {
  static String = String
  static Number = Number
  static Boolean = Boolean
  static Array = (dataType: SingleType) => new ArrayDataType(dataType)
  static Map = (valueDataType: SingleType) => new MapDataType(valueDataType)
  static Object = Object

  _schema: DenericSchema

  constructor(schema: DenericSchema) {
    this._schema = schema
  }

  clone<T extends Deneric>(): T {
    return cloneDeep(this) as unknown as T
  }

  fromJson<T extends Deneric>(data: any): T {
    if (this._schema) {
      Object.keys(this._schema).forEach(key => {
        const [dataPath, dataType] = this._schema[key]
        const defaultValue = get(this, key) ?? getDefaultValue(dataType)
        const value = Utils.transformData(cloneDeep(get(data, dataPath)), dataType, defaultValue)
        set(this, key, value)
      })
    } else {
      throw Error('Missing Schema')
    }
    return this as unknown as T
  }

  toJson(): object {
    const json = {}
    if (this._schema) {
      Object.keys(this._schema).forEach(key => {
        if (this._schema) {
          const [dataPath] = this._schema[key]
          set(json, dataPath, get(this, key))
        }
      })
    }
    return json
  }

  // get serialize(): object {
  //   const serializeObj = {}
  //   if (this._schema) {
  //     Object.keys(this._schema).forEach(key => {
  //       if (this._schema) {
  //         const [dataPath] = this._schema[key]
  //         set(serializeObj, dataPath, get(this, key))
  //       }
  //     })
  //   }
  //   return serializeObj
  // }
}

export default Deneric