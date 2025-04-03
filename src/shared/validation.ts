import { z } from 'zod';

export function isNumberString(value: unknown): boolean {
  return z
    .string()
    .refine((val) => !isNaN(Number(val)) && val.trim() !== '')
    .safeParse(value).success;
}

export function isNumber(value: unknown): boolean {
  return z.number().safeParse(value).success;
}

export function isObject(value: unknown): boolean {
  return z.object({}).safeParse(value).success;
}

export function isDefined(value: unknown) {
  return !z.null().or(z.undefined()).safeParse(value).success;
}
