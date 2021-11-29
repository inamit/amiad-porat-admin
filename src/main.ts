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

// Vue.config.productionTip = false;
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
console.log(firebaseConfig);
initializeApp(firebaseConfig);

const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "localhost", 5001);

const auth = getAuth(getApp());
connectAuthEmulator(auth, "http://localhost:9099");

const firestore = getFirestore(getApp());
connectFirestoreEmulator(firestore, "localhost", 8082);

setPersistence(getAuth(), browserLocalPersistence);
Vue.use(VueCookies);

new Vue({
  router,
  store: store.original,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
