export default class User {
  public uid: string;
  public firstName: string;
  public lastName: string;

  constructor(uid: string, firstName: string, lastName: string) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
