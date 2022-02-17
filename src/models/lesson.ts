import StudentStatus from "./studentStatus";
import User from "./user";

export default class Lesson {
  private id: string;
  private start: Date;
  private end: Date;
  private isOpen: boolean;
  public tutor: User | null;
  private students: { student: User; status: StudentStatus }[];
  private subject: string;
  name = "תגבור";
  get color() {
    return this.subject == "math"
      ? this.isOpen
        ? "primary"
        : "#c09eff"
      : this.isOpen
      ? "#ff8940"
      : "#ffaa75";
  }

  static empty(): Lesson {
    return new Lesson("", new Date(), false, new User("", "", ""), [], "");
  }

  constructor(
    id: string,
    date: Date,
    isOpen: boolean,
    tutor: User | null,
    students: { student: User; status: StudentStatus }[],
    subject: string
  ) {
    this.id = id;
    this.start = date;
    this.isOpen = isOpen;
    this.tutor = tutor;
    this.students = students;
    this.subject = subject;
    this.end = new Date(this.start.getTime() + 60 * 60 * 1000);
  }
}
