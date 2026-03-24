import type { User } from 'generated/prisma/client';
import type { SanitizedUser } from '../types/user.types';

export function sanitizeUser<T extends User>(user: T): SanitizedUser {
  return {
    id: user.id,
    email: user.email,
    full_name: user.fullName,
    country_code: user.countryCode,
  };
}
