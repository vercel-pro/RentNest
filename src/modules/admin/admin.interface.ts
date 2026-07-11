import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePhoto?: string;
  role: Role;
  status: UserStatus;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
