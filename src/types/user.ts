export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
};