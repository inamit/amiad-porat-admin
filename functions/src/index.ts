import * as functions from "firebase-functions";
import { auth, firestore, initializeApp } from "firebase-admin";
import { HttpsError } from "firebase-functions/lib/providers/https";
import { DocumentSnapshot } from "firebase-functions/v1/firestore";

initializeApp();

export const createUser = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called from an App Check verified app."
    );
  }

  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User cannot access this information"
    );
  }

  try {
    const { uid } = await auth().createUser({
      email: data.email,
      password: data.password,
    });

    await auth().setCustomUserClaims(uid, { role: data.role });

    const info = {
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      phoneNo: data.phoneNo,
      ...(data.grade && { grade: data.grade }),
      ...(data.group && { group: data.group }),
      ...(data.subjects && { subjects: data.subjects }),
      role: data.role,
    };

    await firestore().collection("users").doc(uid).set(info);
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-exists":
        throw new HttpsError("already-exists", "המייל כבר קיים במערכת");
      default:
        throw new HttpsError("internal", "קרתה תקלה. פנה לתמיכה");
    }
  }
});

export const getAllUsers = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called from an App Check verified app."
    );
  }

  if (!context.auth && context.auth!.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User cannot access this information"
    );
  }

  const { users } = await auth().listUsers();

  return await Promise.all(
    users.map(async ({ uid, email, metadata, customClaims, phoneNumber }) => {
      const userInfo: DocumentSnapshot = await firestore()
        .collection("users")
        .doc(uid)
        .get();

      const response: any = {
        ...userInfo.data(),
        uid,
        email,
        metadata,
        customClaims,
        phoneNumber,
      };

      if (response.group) {
        const group = (
          await firestore().collection("groups").doc(response.group).get()
        ).data()!;

        const teacher = await firestore()
          .collection("users")
          .doc(group?.teacher)
          .get();

        group.teacher = {};

        group.teacher.firstName = teacher.get("firstName");
        group.teacher.lastName = teacher.get("lastName");
        response.group = group;
      }

      return response;
    })
  );
});

export const getUsersByRole = functions.https.onCall(async (data, context) => {
  if (context.app == undefined) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called from an App Check verified app."
    );
  }

  if (!context.auth && context.auth!.token.role !== "admin") {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User cannot access this information"
    );
  }

  const docs = await firestore()
    .collection("users")
    .where("role", "==", data.role)
    .get();

  const users: any[] = [];
  docs.forEach((doc) => users.push({ uid: doc.id, ...doc.data() }));

  return users;
});
