/** @module DataModel Contains the DataModel class. */



/**
 * Represents a data model's class, which contains methods for exporting and importing objects as datas.
 * 
 * How to use:
 * ```js
 * const Class: DataModel<{data: string}> =
 * class ClassConstruct implements DataModelConstructor<{data: string}> {
 *     toData(): { data: string; } {
 *         return { data: "" }
 *     }
 * 
 *     static fromData(data: { data: string; }): Test {
 *         return new Test()
 *     }
 * }
 * ```
*/
interface DataModelClass<T> {
    fromData(data: T): DataModel<T>
    new(): DataModel<T>
}
/**
 * Represents a data model. Must be used in conjunction with `DataModel`.
 */
interface DataModel<T> {
    toData(): T;
}
