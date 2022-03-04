import Group, { groupConverter } from "@/models/group";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

const firestore = getFirestore();
const groupsCollectionName = "groups";

export const getAllGroups = async (): Promise<Group[]> => {
  const groups = await getDocs(
    collection(firestore, groupsCollectionName).withConverter(groupConverter)
  );

  return groups.docs.map((doc) => doc.data());
};
