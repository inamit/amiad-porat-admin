import StudentStatus from "@/enums/studentStatus";
import Lesson, { lessonConverter } from "@/models/lesson";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const firestore = getFirestore();

export const getAllLessonsBetween = async (
  start: Date,
  end: Date
): Promise<Lesson[]> => {
  const lessonsQuery = query(
    collection(firestore, "lessons"),
    where("date", ">=", start),
    where("date", "<=", end)
  );

  const lessons = await getDocs(lessonsQuery.withConverter(lessonConverter));

  return lessons.docs.map((lesson) => lesson.data());
};

export const addStudentsToLesson = async (
  lessonId: string,
  studentIds: string[]
): Promise<{ student: string; status: StudentStatus }[]> => {
  const lessonToAdd = doc(firestore, "lessons", lessonId);

  const studentsToAdd = studentIds.map((studentId) => {
    return { student: studentId, status: StudentStatus.Scheduled };
  });

  await updateDoc(lessonToAdd, { students: arrayUnion(...studentsToAdd) });

  return studentsToAdd;
};

export const updateLesson = async (
  lessonId: string,
  updates: Partial<Lesson>
) => {
  const lesson = doc(firestore, "lessons", lessonId).withConverter(
    lessonConverter
  );

  await setDoc(lesson, updates);
};
