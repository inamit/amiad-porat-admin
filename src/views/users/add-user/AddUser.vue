<template>
  <v-form>
    <v-text-field
      v-model="firstname"
      :prepend-inner-icon="icons.mdiAccountOutline"
      label="First Name"
      outlined
      dense
      placeholder="First Name"
    />
    <v-text-field
      v-model="lastName"
      :prepend-inner-icon="icons.mdiAccountOutline"
      label="Last Name"
      outlined
      dense
      placeholder="Last Name"
    />

    <v-text-field
      v-model="email"
      :prepend-inner-icon="icons.mdiEmailOutline"
      label="Email"
      type="email"
      outlined
      dense
      placeholder="Email"
    />

    <v-text-field
      v-model="mobile"
      :prepend-inner-icon="icons.mdiCellphone"
      label="Mobile"
      outlined
      dense
      type="number"
      placeholder="Number"
    />

    <v-text-field
      v-model="password"
      :prepend-inner-icon="icons.mdiLockOutline"
      label="Password"
      outlined
      dense
      type="password"
      placeholder="password"
    />

    <v-checkbox v-model="checkbox" label="Remember me" class="mt-0" />

    <v-btn color="primary" @click="addUser"> Submit </v-btn>
    <v-btn type="reset" outlined class="mx-2"> Reset </v-btn>
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
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { httpsCallable, getFunctions } from "firebase/functions";

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
      role: "admin",
    });
  }
}
</script>
