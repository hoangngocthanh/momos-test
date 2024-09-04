import { JwtPayload } from "jwt-decode";

export interface TokenDecoded extends JwtPayload {
  email: string;
  provider: "email";
  userId: string;
  sub: string;
  firstName: string;
  lastName: string;
  email_verified: boolean;
}

export type UserInfo = {
  email: string;
  userId: string;
} | null;

export interface AuthContextProps {
  isAuthenticated: boolean;
  userInfo: UserInfo;
  synchronizeLoginData: ({
    access_token,
    callback,
  }: {
    access_token: string;
    callback?: () => void;
  }) => void;
  logout: () => void;
  loading?: boolean;
}

export type LoginFormValues = {
  email: string;
  password: string;
};
