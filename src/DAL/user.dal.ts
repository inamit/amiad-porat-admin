import UserRole from "@/enums/userRoles";
import User, { userConverter } from "@/models/user";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  query,
  where,
  documentId,
  getDocs,
  WhereFilterOp,
} from "firebase/firestore";

export const getUserByID = async (id: string): Promise<User | undefined> => {
  const firestore = getFirestore();
  const userDoc = doc(firestore, "users", id);
  const snapshot = await getDoc(userDoc.withConverter(userConverter));

  return snapshot.data();
};

export const getUsersByMultipleIDs = async (ids: string[]): Promise<User[]> => {
  const firestore = getFirestore();
  const userQuery = query(
    collection(firestore, "users"),
    where(documentId(), "in", ids)
  );
  const snapshot = await getDocs(userQuery.withConverter(userConverter));

  return snapshot.docs.map((doc) => doc.data());
};

export const getUsersWithRoleBiggerThan = async (
  minRole: UserRole
): Promise<User[]> => {
  return queryRole(">=", minRole);
};

export const getUsersWithRole = async (role: UserRole) => {
  return queryRole("==", role);
};

export const getUsersWithRoleAndExclude = async (
  role: UserRole,
  userId: string[]
) => {
  const firestore = getFirestore();

  const userQuery = query(
    collection(firestore, "users"),
    where("role", "==", role),
    where(documentId(), "not-in", userId)
  );
  const snapshot = await getDocs(userQuery.withConverter(userConverter));

  return snapshot.docs.map((doc) => doc.data());
};

const queryRole = async (operator: WhereFilterOp, role: UserRole) => {
  const firestore = getFirestore();

  const userQuery = query(
    collection(firestore, "users"),
    where("role", operator, role)
  );
  const snapshot = await getDocs(userQuery.withConverter(userConverter));

  return snapshot.docs.map((doc) => doc.data());
};
