<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-uppercase">שם</th>
          <th class="text-center text-uppercase">אימייל</th>
          <th class="text-center text-uppercase">מס' טלפון</th>
          <th class="text-center text-uppercase">תאריך לידה</th>
          <th class="text-center text-uppercase">כיתה</th>
          <th class="text-center text-uppercase">קבוצה</th>
          <th class="text-center text-uppercase">סוג משתמש</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.uid">
          <td>{{ user.firstName + user.lastName }}</td>
          <td>
            {{ user.email }}
          </td>
          <td class="text-center">
            {{ user.phoneNo }}
          </td>
          <td class="text-center">
            {{ user.birthDate }}
          </td>
          <td class="text-center">
            {{ user.grade }}
          </td>
          <td class="text-center">
            {{ user.group }}
          </td>
          <td class="text-center">
            {{ user.customClaims.role }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getFunctions, httpsCallable } from "firebase/functions";

@Component({ name: "ListUsers" })
export default class ListUsers extends Vue {
  users = [];

  async created() {
    const getUsers = httpsCallable(getFunctions(), "getAllUsers");

    this.users = (await getUsers()).data as [];
  }
}
</script>
