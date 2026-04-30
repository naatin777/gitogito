type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type Builtin = Primitive | Date | RegExp | ((...args: never[]) => unknown);

type IsPlainObject<T> = T extends Builtin
  ? false
  : T extends readonly unknown[]
    ? false
    : T extends object
      ? true
      : false;

export type NestedKeys<T> = {
  [K in keyof T & string]: IsPlainObject<T[K]> extends true ? `${K}` | `${K}.${NestedKeys<T[K]>}` : `${K}`;
}[keyof T & string];

export type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;
