export interface VerifyOtpResponse {
  access_token: string;
  user: {
    id: string | number;
    email: string;
    fullName: string;
    countryCode: string;
    createdAt: string;
    updatedAt: string;
  };
}
