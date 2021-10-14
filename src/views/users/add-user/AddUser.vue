<template>
  <v-form>
    <v-text-field
      v-model="firstname"
      :prepend-inner-icon="icons.mdiAccountOutline"
      label="שם פרטי"
      outlined
      dense
      placeholder="שם פרטי"
    />
    <v-text-field
      v-model="lastName"
      :prepend-inner-icon="icons.mdiAccountOutline"
      label="שם משפחה"
      outlined
      dense
      placeholder="שם משפחה"
    />

    <v-text-field
      v-model="email"
      :prepend-inner-icon="icons.mdiEmailOutline"
      label="מייל"
      type="email"
      outlined
      dense
      placeholder="מייל"
    />

    <v-text-field
      v-model="mobile"
      :prepend-inner-icon="icons.mdiCellphone"
      label="מספר טלפון"
      outlined
      dense
      type="number"
      placeholder="מספר טלפון"
    />

    <v-text-field
      v-model="password"
      :prepend-inner-icon="icons.mdiLockOutline"
      label="סיסמה"
      outlined
      dense
      type="password"
      placeholder="סיסמה"
    />

    <v-checkbox v-model="checkbox" label="Remember me" class="mt-0" />

    <v-btn color="primary" @click="addUser"> צור משתמש </v-btn>
    <v-btn type="reset" outlined class="mx-2"> אפס </v-btn>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  mdiAccountOutline,
  mdiEmailOutline,
  mdiCellphone,
  mdiLockOutline,
} from "@mdi/js";
import { getFunctions, httpsCallable } from "firebase/functions";

@Component({ name: "AddUser" })
export default class AddUser extends Vue {
  firstname = "";
  lastName = "";
  email = "";
  mobile = "";
  password = "";
  checkbox = false;

  icons = {
    mdiAccountOutline,
    mdiEmailOutline,
    mdiCellphone,
    mdiLockOutline,
  };

  async addUser() {
    const createUser = httpsCallable(getFunctions(), "createUser");
    createUser({
      email: this.email,
      password: this.password,
      firstName: this.firstname,
      lastName: this.lastName,
      phoneNo: this.mobile,
      role: "student",
    });
  }
}
</script>
