import Lesson, { lessonConverter } from "@/models/lesson";
import {
  collection,
  getDocs,
  getFirestore,
  query,
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
