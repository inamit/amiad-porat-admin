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
              <a href="javascript:void(0)" class="mt-1 ms-1"> שכחתי סיסמה </a>
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
  error = null;

  async login() {
    try {
      this.loading = true;
      const user = await api.User().login(this.username, this.password);

      console.log(user);
    } catch (error) {
      this.error = error.message;
      console.log(error);
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="scss">
@import "~@/plugins/vuetify/default-preset/preset/pages/auth.scss";
</style>
