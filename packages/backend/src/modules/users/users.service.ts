// packages/backend/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { type User, UserSchema } from '@packages/contracts';

@Injectable()
export class UsersService {
  getUser(): User {
    const user = { id: '1', email: 'test@test.com' };
    return UserSchema.parse(user); // runtime validation
  }
}
