export enum UserRole {
  User = "user",
  Manager = "manager",
  Admin = "admin",
}

export interface IUser {
  id: string;
  display_name: string;
  email: string;
  role: {
    id: number;
    name: UserRole;
  };
}

export interface IUserForm extends Omit<IUser, "id"> {
  password?: string;
}
