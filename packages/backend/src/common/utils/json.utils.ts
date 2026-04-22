import type { Prisma } from 'generated/prisma/client';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function isPrismaInputJsonValue(
  value: unknown,
): value is Prisma.InputJsonValue {
  if (value === null) {
    return true;
  }

  const valueType = typeof value;
  if (
    valueType === 'string' ||
    valueType === 'boolean' ||
    (valueType === 'number' && Number.isFinite(value))
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isPrismaInputJsonValue(item));
  }

  if (isPlainObject(value)) {
    return Object.values(value).every((item) => isPrismaInputJsonValue(item));
  }

  return false;
}
