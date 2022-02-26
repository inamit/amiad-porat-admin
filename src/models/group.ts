import { getUserByID } from "@/DAL/user.dal";
import { FirestoreDataConverter } from "firebase/firestore";
import { string } from "joi";
import User from "./user";

export default class Group {
  public id: string;
  public name: string;
  public teacher: User | undefined;

  static initAndFetch(id: string, name: string, teacher: string) {
    const group = new Group(id, name, undefined);
    Group.loadTeacher(group, teacher);

    return group;
  }

  constructor(id: string, name: string, teacher: User | undefined) {
    this.id = id;
    this.name = name;
    this.teacher = teacher;
  }

  private static async loadTeacher(group: Group, id: string) {
    group.teacher = await getUserByID(id);
  }
}

export const groupConverter: FirestoreDataConverter<Group> = {
  toFirestore: (group: Group) => {
    return {
      name: group.name,
      teacher: group.teacher?.uid,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);

    return Group.initAndFetch(snapshot.id, data.name, data.teacher);
  },
};
