import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueCookies from "vue-cookies";
import axios from "axios";
import { initializeApp, getApp } from "firebase/app";
import {
  setPersistence,
  getAuth,
  browserLocalPersistence,
  connectAuthEmulator,
} from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { fetchAndActivate, getRemoteConfig } from "firebase/remote-config";
import Gleap from "gleap";

Vue.prototype.$axios = axios;

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};
const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LcwFwMeAAAAABWgShvq1Sps2U8vmVkx39g7wzOa"),
  isTokenAutoRefreshEnabled: true,
});

const remoteConfig = getRemoteConfig(app);

remoteConfig.defaultConfig = {
  unscheduledStudentWhatsappMessage:
    "היי, מה קורה? שמתי לב שלא קבעת תגבור לשבוע הקרוב!",
};

fetchAndActivate(remoteConfig);

if (process.env.NODE_ENV === "development") {
  console.log(firebaseConfig);
  console.log("testing locally -- hitting local auth and firestore emulators");

  const functions = getFunctions(app);
  connectFunctionsEmulator(functions, "localhost", 5001);

  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://localhost:9099");

  const firestore = getFirestore(app);
  connectFirestoreEmulator(firestore, "localhost", 8082);
}

setPersistence(getAuth(), browserLocalPersistence);
Vue.use(VueCookies);

// Gleap.initialize("BuFvw4c2u7py7vIjC0lo1ArvJTcEHVz8");
// Gleap.setLanguage("en");
// // Gleap.setLanguage("he");
// Gleap.setLiveSite(process.env.NODE_ENV !== "development");
// Gleap.attachCustomData({
//   app: "admin",
// });

new Vue({
  router,
  store: store.original,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
