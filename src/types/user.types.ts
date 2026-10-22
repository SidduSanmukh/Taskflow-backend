export interface User {
  name: string;
  email: string;
  password: string;
}

export interface createUser {
  name: string;
  email: string;
  password: string;
}

export interface updateUser {
  name?: string;
  email?: string;
  password?: string;
}
