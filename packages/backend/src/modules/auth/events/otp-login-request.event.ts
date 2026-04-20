import { SanitizedUser } from 'src/common/types/user.types';

export class OtpLoginRequestEvent {
  constructor(public readonly payload: { user: SanitizedUser; otp: string }) {}
}
