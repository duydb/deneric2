import get from 'lodash/get'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import isObject from 'lodash/isObject'

type CommonType = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor
type SingleType = CommonType | Deneric | typeof Deneric
type TDataType = SingleType | ComplexDataType
type Newable = { new(value?: any): Deneric }
export type DenericSchema = { [key: string]: [dataPath: string, dataType: TDataType, jsonIgnore?: boolean, defaultValue?: any] }
const COMMON_DATA_TYPES: CommonType[] = [String, Number, Boolean, Array, Object]
const DENERIC_SCHEMA_PATH: string = '__deneric_schema'

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
  getValue(data: any, dataPath: string) {
    if (!!dataPath) {
      return get(data, dataPath)
    }
    return data
  },
  getValueFromJson(data: any, dataType: TDataType, defaultValue: any, strict: boolean): any {
    // Handle dataType is Deneric Instance
    if ((dataType as typeof Deneric).prototype instanceof Deneric) {
      return new (dataType as unknown as Newable)(data)
    }

    // Handle dataType is ComplexDataType
    if (dataType instanceof ComplexDataType) {
      const complexDataType = dataType as ComplexDataType
      if (complexDataType.isArray) {
        return Array.isArray(data) ? data.map(item => Utils.getValueFromJson(item, complexDataType.itemType, Utils.getDefaultValue(complexDataType.itemType), strict)) : defaultValue
      }
      if (complexDataType.isMap && isObject(data)) {
        return Object.keys(data).reduce((prev, key) => {
          set(prev, key, Utils.getValueFromJson(Utils.getValue(data, key), complexDataType.itemType, Utils.getDefaultValue(complexDataType.itemType), strict))
          return prev
        }, {})
      }
      return defaultValue
    }

    const dataIsNil = data === null || data === undefined
    // Handle dataType is not common types
    if (!COMMON_DATA_TYPES.includes(dataType as CommonType)) {
      return dataIsNil ? defaultValue : data
    }

    // Handle dataType is common types with strict rule
    if (strict) {
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
    }

    // Handle dataType is common types with no-strict rule and data is not Nil
    if (!strict && !dataIsNil) {
      switch (dataType) {
        case String:
          return String(data)
        case Number:
          return Number(data)
        case Boolean:
          return Boolean(data)
        case Array:
          return [].concat(data)
        case Object:
          return Object(data)
      }
    }

    return defaultValue
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
        return isObject(data) ? cloneDeep(data) : defaultValue
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
    if (dataType instanceof ComplexDataType) {
      const complexDataType = dataType as ComplexDataType
      if (complexDataType.isArray) {
        return []
      }
      if (complexDataType.isMap) {
        return {}
      }
    }

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
  },
  setSchema(instance: Deneric, schema: DenericSchema): void {
    Object.defineProperty(instance,DENERIC_SCHEMA_PATH,{
      enumerable: false,
      value: schema
    })
  },
  getSchema(instance: Deneric): DenericSchema {
    return get(instance, DENERIC_SCHEMA_PATH) || {} as DenericSchema
  }
})

abstract class Deneric {
  static Array = (dataType: TDataType) => new ArrayDataType(dataType)
  static Map = (valueDataType: TDataType) => new MapDataType(valueDataType)
  static Utils = Utils

  // private __proto__!: { schema: DenericSchema }

  constructor(schema: DenericSchema) {
    if (!schema) {
      throw new TypeError('Invalid schema: ' + this.constructor.name)
    }
    Utils.setSchema(this, schema)
  }

  clone<T extends Deneric>(): T {
    return cloneDeep(this) as unknown as T
  }

  fromJson<T extends Deneric>(data: any, strict: boolean = true): T {
    const schema: DenericSchema = Utils.getSchema(this)
    Object.keys(schema).forEach(key => {
      const [dataPath, dataType] = schema[key]
      let defaultValue = get(this, key) ?? Utils.getDefaultValue(dataType)

      if (schema[key][3] === undefined) {
        schema[key][3] = defaultValue
      } else {
        defaultValue = schema[key][3] ?? Utils.getDefaultValue(dataType)
      }
      const value = Utils.getValueFromJson(cloneDeep(Utils.getValue(data, dataPath)), dataType, defaultValue, strict)
      set(this, key, value)
    })
    return this as unknown as T
  }

  toJson(): object {
    const schema: DenericSchema = Utils.getSchema(this)
    const json = {}
    Object.keys(schema).forEach(key => {
      const [dataPath, dataType, jsonIgnore, defaultValueFromSchema] = schema[key]
      if (!jsonIgnore) {
        set(json, dataPath, Utils.getValueFromDeneric(get(this, key), dataType, defaultValueFromSchema || Utils.getDefaultValue(dataType)))
      }
    })
    return json
  }
}

export default Deneric