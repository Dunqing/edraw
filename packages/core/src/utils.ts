import type { LayoutOptions } from "./types";

export type MagnifyTimesType = <
  T extends number | Record<string, number> | number[]
>(
  number: number,
  value: T
) => T;

export const getPadding = (padding?: LayoutOptions["padding"]) => {
  const result = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };
  if (!padding) {
    return result;
  } else if (typeof padding === "number") {
    result.left = padding;
    result.right = padding;
    result.top = padding;
    result.bottom = padding;
    return result;
  } else if (Array.isArray(padding) && padding.length === 2) {
    result.top = padding[0];
    result.right = padding[1];
    result.bottom = padding[0];
    result.left = padding[1];
  } else if (Array.isArray(padding) && padding.length === 4) {
    result.top = padding[0];
    result.right = padding[1];
    result.bottom = padding[2];
    result.left = padding[3];
  }
  return result;
};

export const Omit = <T extends Record<string, any>, F extends keyof T>(
  obj: T,
  keys: F[]
) => {
  keys.forEach((key) => {
    Reflect.deleteProperty(obj, key);
  });

  return obj as Omit<T, F>;
};

export const isNumber = (v: any) => typeof v === "number";
