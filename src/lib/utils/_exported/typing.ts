/** A type, or null, or undefined. */
export type Nullish<T> = T | null | undefined;

/** Any non-function type. */
export type NotFunction = null | undefined | number | string | boolean | symbol | bigint | object;

/** Phantom attribute for marking type parameters as used.
 *
 * @example
 * ```ts
 * // eslint-disable-next-line @typescript-eslint/no-unused-vars
 * type Foo<A> = object // ❌ 'A' is declared but its value is never read. [6133]
 *
 * type Foo<A> = object & Phantom<A> // ✅ no warnings/hints
 *
 * // eslint-disable-next-line @typescript-eslint/no-unused-vars
 * interface ColumnMeta<TData extends RowData, TValue> {  // ❌ All type parameters are unused. [6205]
 *   cellClass: string;
 * }
 *
 * interface ColumnMeta<TData extends RowData, TValue> extends Phantom<TData & TValue> {  // ✅ no warnings/hints
 *   cellClass: string;
 * }
 * ```
 */
export type Phantom<T> = { readonly __phantom?: T & never };
