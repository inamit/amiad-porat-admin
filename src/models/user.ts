import { FirestoreDataConverter } from "firebase/firestore";
export default class User {
  public uid: string;
  public firstName: string;
  public lastName: string;

  static empty() {
    return new User("", "", "");
  }

  constructor(uid: string, firstName: string, lastName: string) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User) => {
    return { firstName: user.firstName, lastName: user.lastName };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);

    return new User(snapshot.id, data.firstName, data.lastName);
  },
};
