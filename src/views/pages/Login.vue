<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <router-link to="/" class="d-flex align-center">
            <v-img
              :src="require('@/assets/images/logos/amiad_logo_transparent.png')"
              max-height="300px"
              max-width="300px"
              alt="logo"
              contain
              class="me-3"
            />
          </router-link>
        </v-card-title>

        <!-- login form -->
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="username"
              outlined
              label="שם משתמש"
              placeholder=""
              class="mb-3"
              :rules="rules.usernameRules"
              required
            />

            <v-text-field
              v-model="password"
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="סיסמה"
              placeholder="············"
              :rules="rules.passwordRules"
              :append-icon="
                isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline
              "
              required
              @click:append="isPasswordVisible = !isPasswordVisible"
            />

            <div style="color: red">
              {{ error }}
            </div>

            <div class="d-flex align-center justify-space-between flex-wrap">
              <!-- forgot link -->
              <a @click="resetPassword" class="mt-1 ms-1"> שכחתי סיסמה </a>
            </div>

            <v-btn
              block
              color="primary"
              class="mt-6"
              :disabled="!valid"
              :loading="loading"
              @click="login"
            >
              התחבר
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>

    <!-- background triangle shape  -->
    <img
      class="auth-mask-bg"
      height="173"
      :src="
        require(`@/assets/images/misc/mask-${
          $vuetify.theme.dark ? 'dark' : 'light'
        }.png`)
      "
    />

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="247"
      height="185"
      src="@/assets/images/misc/tree.png"
    />

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="377"
      height="289"
      src="@/assets/images/misc/tree-3.png"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import api from "@/api/api";
import {
  getAuth,
  signInWithEmailAndPassword,
  AuthErrorCodes,
  sendPasswordResetEmail,
} from "firebase/auth";
import Swal from "sweetalert2";
import { use } from "vue/types/umd";
import router from "@/router";

@Component({ name: "Login" })
export default class Login extends Vue {
  isPasswordVisible = false;
  username = "";
  password = "";
  icons = {
    mdiEyeOutline,
    mdiEyeOffOutline,
  };
  valid = true;
  rules = {
    usernameRules: [(v: string) => Boolean(v) || "יש למלא שם משתמש"],
    passwordRules: [(v: any) => Boolean(v) || "יש למלא סיסמה"],
  };
  loading = false;
  error = "";

  async login() {
    try {
      this.loading = true;
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        this.username,
        this.password
      );
      // const user = await api.User().login(this.username, this.password);
      console.log(userCredential.user);

      if (userCredential.user) {
        router.push("dashboard");
      }
    } catch (error) {
      switch (error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          this.error = "יש לכתוב כתובת מייל תקינה";
          break;
        case AuthErrorCodes.INVALID_PASSWORD:
        case AuthErrorCodes.USER_DELETED:
          this.error = "המייל/סיסמה לא נכונים. נסה שנית";
          break;

        default:
          this.error = error.message;
          break;
      }
      console.log(error);
    } finally {
      this.loading = false;
    }
  }

  async resetPassword() {
    const email = await Swal.fire({
      title: "הכנס כתובת מייל",
      icon: "question",
      input: "email",
    });
    try {
      await sendPasswordResetEmail(getAuth(), email.value);
      Swal.fire({
        title: "הצלחנו!",
        text: "שלחנו לך קישור במייל. עקוב אחריו ואפס את סיסמתך",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "שגיאה",
        text: "הייתה שגיאה בשליחת המייל. נסה שנית",
        icon: "error",
      });
    }
  }
}
</script>

<style lang="scss">
@import "~@/plugins/vuetify/default-preset/preset/pages/auth.scss";
</style>
