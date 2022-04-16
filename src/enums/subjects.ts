export enum Subject {
  MATH = "math",
  ENGLISH = "english",
}

export const getHebrewSubject = (subject: string): string => {
  switch (subject) {
    case Subject.MATH:
      return "מתמטיקה";
    case Subject.ENGLISH:
      return "אנגלית";
    default:
      return "";
  }
};
