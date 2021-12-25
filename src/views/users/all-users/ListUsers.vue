<template>
  <v-data-table
    :headers="headers"
    :items="filteredUsers"
    :search="search"
    :loading="loading"
    loading-text="טוען מידע..."
    item-key="uid"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-text-field
        v-model="search"
        :append-icon="icons.mdiMagnify"
        label="חיפוש (לפי טלפון/מייל/תאריך לידה/כיתה בלבד). בכדי לחפש לפי פרמטר אחר יש ללחוץ על האייקון שלידו"
        class="mx-4"
      ></v-text-field>
    </template>

    <template v-slot:[`header.name`]="{ header }">
      {{ header.text }}

      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>{{ icons.mdiFilter }}</v-icon>
          </v-btn>
        </template>
        <v-sheet style="padding: 20px">
          <v-text-field v-model="nameFilter" label="שם"></v-text-field>
          <v-btn @click="nameFilter = ''"> איפוס </v-btn>
        </v-sheet>
      </v-menu>
    </template>
    <template v-slot:[`header.customClaims.role`]="{ header }">
      {{ header.text }}

      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>{{ icons.mdiFilter }}</v-icon>
          </v-btn>
        </template>
        <v-sheet style="padding: 20px">
          <v-select :items="roles" label="סוג משתמש" v-model="roleFilter">
          </v-select>
          <v-btn @click="roleFilter = ''"> איפוס </v-btn>
        </v-sheet>
      </v-menu>
    </template>

    <template v-slot:[`item.name`]="{ item }">
      <td>{{ item.firstName }} {{ item.lastName }}</td>
    </template>
    <template v-slot:[`item.email`]="{ item }">
      <a :href="`mailto:${item.email}`">{{ item.email }}</a>
    </template>
    <template v-slot:[`item.group`]="{ item }">
      <v-tooltip v-if="item.group" bottom>
        <template v-slot:activator="{ on, attrs }">
          <span v-on="on" v-bind="attrs">{{ item.group.name }}</span>
        </template>
        <span
          >מורה: {{ item.group.teacher.firstName }}
          {{ item.group.teacher.lastName }}</span
        >
      </v-tooltip>
    </template>
    <template v-slot:[`item.customClaims.role`]="{ item }">
      {{ getRoleText(item.customClaims.role) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getFunctions, httpsCallable } from "firebase/functions";
import { mdiFilter, mdiMagnify } from "@mdi/js";

@Component({ name: "ListUsers" })
export default class ListUsers extends Vue {
  users = [];
  search = "";

  icons = {
    mdiFilter,
    mdiMagnify,
  };

  roles = [
    { text: "תלמיד", value: "student" },
    { text: "מתרגל", value: "tutor" },
    { text: "מורה", value: "teacher" },
    { text: "מנהל", value: "admin" },
  ];

  getRoleText(roleValue: string) {
    return this.roles.find((role) => role.value === roleValue)?.text;
  }

  roleFilter = "";
  nameFilter = "";

  loading = true;

  async created() {
    this.loading = true;
    const getUsers = httpsCallable(getFunctions(), "getAllUsers");

    this.users = (await getUsers()).data as [];
    this.loading = false;
  }

  filterUserRole(user: any) {
    return user.customClaims.role === this.roleFilter;
  }
  filterUserName(user: any) {
    return (
      user.firstName?.includes(this.nameFilter) ||
      user.lastName?.includes(this.nameFilter)
    );
  }

  get filteredUsers() {
    const conditions: any[] = [];

    if (this.roleFilter !== "") {
      conditions.push(this.filterUserRole);
    }
    if (this.nameFilter !== "") {
      conditions.push(this.filterUserName);
    }

    if (conditions.length > 0) {
      return this.users.filter((user) => {
        return conditions.every((condition) => {
          return condition(user);
        });
      });
    }
    return this.users;
  }

  get headers() {
    return [
      {
        text: "שם",
        value: "name",
      },
      {
        text: "אימייל",
        value: "email",
      },
      {
        text: "מס' טלפון",
        value: "phoneNo",
      },
      {
        text: "תאריך לידה",
        value: "birthDate",
      },
      {
        text: "כיתה",
        value: "grade",
      },
      {
        text: "קבוצה",
        value: "group",
      },
      {
        text: "סוג משתמש",
        value: "customClaims.role",
      },
    ];
  }
}
</script>
