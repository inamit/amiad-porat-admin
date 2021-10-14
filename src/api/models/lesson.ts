import Room from "./Room";
import Subject from "./Subject";
import { User } from "./User";

export default interface Lesson {
  id: number;
  teacher: User;
  subject: Subject;
  room: Room;
  start_time: Date;
  is_open: boolean;
  students: User[];
}
