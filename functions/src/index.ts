import * as functions from "firebase-functions";
import { auth, firestore, initializeApp } from "firebase-admin";

initializeApp();

export const createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User cannot access this information"
    );
  }

  const { uid } = await auth().createUser({
    email: data.email,
    password: data.password,
  });

  await auth().setCustomUserClaims(uid, { role: data.role });

  await firestore().collection("users").doc(uid).set({
    firstName: data.firstName,
    lastName: data.lastName,
    // birthDate: data.birthDate,
    phoneNo: data.phoneNo,
    // grade: data.grade,
    // group: data.group,
  });
});

export const getAllUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User cannot access this information"
    );
  }

  const { users } = await auth().listUsers();

  return await Promise.all(
    users.map(async ({ uid, email, metadata, customClaims, phoneNumber }) => {
      const userInfo = await firestore().collection("users").doc(uid).get();

      return {
        ...userInfo.data(),
        uid,
        email,
        metadata,
        customClaims,
        phoneNumber,
      };
    })
  );
});
