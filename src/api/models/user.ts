import { Group } from "./group";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  grade: number;
  group: Group;
  birth_date: string;
  phone_no: string;
  role: Role;
  created_at: Date;
}

enum Roles {
  student,
  tutor,
  teacher,
  admin,
}
type Role = keyof typeof Roles;
