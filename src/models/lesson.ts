import { getUserByID, getUsersByMultipleIDs } from "@/DAL/user.dal";
import { FirestoreDataConverter } from "firebase/firestore";
import StudentStatus from "../enums/studentStatus";
import User from "./user";

export default class Lesson {
  public id: string;
  public start: Date;
  public end: Date;
  public isOpen: boolean;
  public tutor: User | undefined;
  public students: { student: User | undefined; status: StudentStatus }[];
  public subject: string;

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
    return new Lesson("", new Date(), false, User.empty(), [], "");
  }

  static initAndFetch(
    id: string,
    date: Date,
    isOpen: boolean,
    tutor: string,
    students: { student: string; status: StudentStatus }[],
    subject: string
  ): Lesson {
    const lesson = new Lesson(id, date, isOpen, undefined, [], subject);
    Lesson.loadTutor(lesson, tutor);
    Lesson.loadStudents(lesson, students);

    return lesson;
  }

  constructor(
    id: string,
    date: Date,
    isOpen: boolean,
    tutor: User | undefined,
    students: { student: User; status: StudentStatus }[],
    subject: string
  ) {
    this.id = id;
    this.start = date;
    this.isOpen = isOpen;
    this.subject = subject;
    this.end = new Date(date.getTime() + 60 * 60 * 1000);
    this.students = students;
    this.tutor = tutor;
  }

  private static async loadTutor(lesson: Lesson, id: string) {
    lesson.tutor = await getUserByID(id);
  }

  private static async loadStudents(
    lesson: Lesson,
    students: { student: string; status: StudentStatus }[]
  ) {
    if (students.length > 0) {
      const studentsMapped = await getUsersByMultipleIDs(
        students.map((value) => value.student)
      );

      lesson.students = students.map((value) => {
        return {
          student: studentsMapped.find(
            (student) => student.uid === value.student
          ),
          status: value.status,
        };
      });
    }
  }
}

export const lessonConverter: FirestoreDataConverter<Lesson> = {
  toFirestore: (lesson: Lesson) => {
    return {
      date: lesson.start,
      isOpen: lesson.isOpen,
      tutor: lesson.tutor?.uid,
      students: lesson.students.map((value) => {
        return { student: value.student?.uid, status: value.status };
      }),
      subject: lesson.subject,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);

    return Lesson.initAndFetch(
      snapshot.id,
      data.date.toDate(),
      data.isOpen,
      data.tutor,
      data.students,
      data.subject
    );
  },
};
