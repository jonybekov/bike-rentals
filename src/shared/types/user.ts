export enum UserRole {
  User = "User",
  Manager = "Manager",
}

export interface IUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
}

export type IUserForm = Omit<IUser, "id">;
