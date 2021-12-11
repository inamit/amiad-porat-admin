export default class User {
  private uid: string;
  private firstName: string;
  private lastName: string;

  constructor(uid: string, firstName: string, lastName: string) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
