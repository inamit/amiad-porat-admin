import { User } from "./user";

export interface Group {
  id: number;
  teacher: User;
  group_name: string;
}
