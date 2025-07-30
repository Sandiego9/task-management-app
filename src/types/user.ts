export interface AuthenticatedUser {
  uid: string;
  isAdmin: boolean;
  email: string | null;
  displayName: string | null;
};

export interface DecodedToken {
  _id: string;
  isAdmin: boolean;
  iat: number;
};