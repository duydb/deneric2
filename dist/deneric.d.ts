declare type CommonType = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor | ObjectConstructor;
declare type SingleType = CommonType | Deneric | typeof Deneric;
declare type TDataType = SingleType | ComplexDataType;
export declare type DenericSchema = {
    [key: string]: [dataPath: string, dataType: TDataType, jsonIgnore?: boolean, defaultValue?: any];
};
declare abstract class ComplexDataType {
    abstract itemType: SingleType | ComplexDataType;
    isArray: boolean;
    isMap: boolean;
}
declare class ArrayDataType extends ComplexDataType {
    itemType: SingleType | ComplexDataType;
    isArray: boolean;
    constructor(itemType: SingleType | ComplexDataType);
}
declare class MapDataType extends ComplexDataType {
    itemType: SingleType | ComplexDataType;
    isMap: boolean;
    constructor(itemType: SingleType | ComplexDataType);
}
declare abstract class Deneric {
    static Array: (dataType: TDataType) => ArrayDataType;
    static Map: (valueDataType: TDataType) => MapDataType;
    private __proto__;
    constructor(schema: DenericSchema);
    clone<T extends Deneric>(): T;
    fromJson<T extends Deneric>(data: any, strict?: boolean): T;
    toJson(): object;
}
export default Deneric;
