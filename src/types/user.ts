export interface AuthenticatedUser {
  id: string;
  fullName: string;
  profileImage: string;
  email: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  portfolio?: string;
  isAdmin: boolean;
}

export interface DecodedToken {
  _id: string;
  isAdmin: boolean;
  iat: number;
};