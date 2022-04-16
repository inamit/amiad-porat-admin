import Group, { groupConverter } from "@/models/group";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const firestore = getFirestore();
const groupsCollectionName = "groups";

export const getAllGroups = async (): Promise<Group[]> => {
  const groups = await getDocs(
    collection(firestore, groupsCollectionName).withConverter(groupConverter)
  );

  return groups.docs.map((doc) => doc.data());
};

export const getGroupsByDay = async (day: number): Promise<Group[]> => {
  const groupsQuery = query(
    collection(firestore, "groups"),
    where("dayInWeek", ">=", day)
  );

  const groups = await getDocs(groupsQuery.withConverter(groupConverter));

  return groups.docs.map((doc) => doc.data());
};
