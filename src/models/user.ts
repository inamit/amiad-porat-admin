import UserRole from "@/enums/userRoles";
import { FirestoreDataConverter } from "firebase/firestore";
export default class User {
  public uid: string;
  public firstName: string;
  public lastName: string;
  public phoneNo: string;
  public role: UserRole;

  static empty() {
    return new User("", "", "", "", UserRole.STUDENT);
  }

  constructor(
    uid: string,
    firstName: string,
    lastName: string,
    phoneNo: string,
    role: number
  ) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNo = phoneNo;
    this.role = role;
  }
}

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User) => {
    return { firstName: user.firstName, lastName: user.lastName };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);

    return new User(
      snapshot.id,
      data.firstName,
      data.lastName,
      data.phoneNo,
      data.role
    );
  },
};
