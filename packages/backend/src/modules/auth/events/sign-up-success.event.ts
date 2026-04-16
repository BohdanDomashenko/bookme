import type { SanitizedUser } from 'src/common/types/user.types';

export class SignUpSuccessEvent {
  constructor(public readonly payload: { user: SanitizedUser }) {}
}
