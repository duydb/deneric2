import get from 'lodash/get'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import isObject from 'lodash/isObject'
import isEmpty from 'lodash/isEmpty'

export type SingleType = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor | Deneric | typeof Deneric
export type TDataType = SingleType | ComplexDataType
export type DenericSchema = { [key: string]: [dataPath: string, dataType: TDataType, jsonIgnore?: boolean] }
type Newable = { new(value?: any): Deneric }

abstract class ComplexDataType {
  abstract itemType: SingleType | ComplexDataType

  isArray: boolean = false
  isMap: boolean = false
}

class ArrayDataType extends ComplexDataType {
  isArray = true
  constructor(public itemType: SingleType | ComplexDataType) {
    super()
  }
}

class MapDataType extends ComplexDataType {
  isMap = true
  constructor(public itemType: SingleType | ComplexDataType) {
    super()
  }
}

const Utils = Object.freeze({
  getValueFromJson(data: any, dataType: TDataType, defaultValue: any): any {
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
    if (dataType instanceof ComplexDataType) {
      const complexDataType = dataType as ComplexDataType
      if (complexDataType.isArray) {
        return Array.isArray(data) ? data.map(item => Utils.getValueFromJson(item, complexDataType.itemType, Utils.getDefaultValue(complexDataType.itemType))) : defaultValue
      }
      if (complexDataType.isMap) {
        if (isObject(data)) {
          return Object.keys(data).reduce((prev, key) => {
            set(prev, key, Utils.getValueFromJson(get(data, key), complexDataType.itemType, Utils.getDefaultValue(complexDataType.itemType)))
            return prev
          }, {})
        }
        return defaultValue
      }
    }

    if ((dataType as typeof Deneric).prototype instanceof Deneric) {
      return new (dataType as unknown as Newable)(data)
    }

    return data
  },
  getValueFromDeneric(data: any, dataType: TDataType, defaultValue: any): any {
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
    if (dataType instanceof ComplexDataType) {
      const complexDataType = dataType as ComplexDataType
      if (complexDataType.isArray) {
        return Array.isArray(data) ? data.map(item => Utils.getValueFromDeneric(item, complexDataType.itemType, Utils.getDefaultValue(complexDataType.itemType))) : defaultValue
      }
      if (complexDataType.isMap) {
        data = isObject(data) ? data : {}
        return Object.keys(data).reduce((prev, key) => {
          set(prev, key, Utils.getValueFromDeneric(data[key], complexDataType.itemType, Utils.getDefaultValue(complexDataType.itemType)))
          return prev
        }, {})
      }
    }

    if ((dataType as typeof Deneric).prototype instanceof Deneric) {
      return (data as Deneric).toJson()
    }

    return data
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
    return undefined
  }
})

abstract class Deneric {
  static Array = (dataType: TDataType) => new ArrayDataType(dataType)
  static Map = (valueDataType: TDataType) => new MapDataType(valueDataType)

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
        const defaultValue = get(this, key) ?? Utils.getDefaultValue(dataType)
        const value = Utils.getValueFromJson(cloneDeep(get(data, dataPath)), dataType, defaultValue)
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
          const [dataPath, dataType, jsonIgnore] = this._schema[key]
          if (!jsonIgnore) {
            set(json, dataPath, Utils.getValueFromDeneric(cloneDeep(get(this, key)), dataType, key))
          }
        }
      })
    }
    return json
  }
}

export default Deneric