export interface AuthenticatedUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  jobTitle: string;
  accountType: string;
}

export interface DecodedToken {
  email: string;
  sub: string; // user ID
  jti: string;
  aud: string;
  iss: string;
  exp: number;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}
