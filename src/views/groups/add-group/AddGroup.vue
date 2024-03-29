<template>
  <v-row justify="center">
    <v-col> </v-col>
    <v-col cols="7">
      <h1>יצירת שיעור חדש</h1>
      <br />
      <v-form v-model="valid" ref="form">
        <v-text-field
          v-model="name"
          :prepend-inner-icon="icons.mdiRenameBox"
          label="שם השיעור"
          outlined
          placeholder="שם השיעור"
          :rules="rules.nameRules"
          required
        />
        <v-select
          :items="teachers"
          v-model="teacher"
          required
          label="מורה"
          outlined
          :prepend-inner-icon="icons.mdiAccountOutline"
        >
          <template v-slot:item="data">
            {{ data.item.firstName }} {{ data.item.lastName }}
          </template>
          <template v-slot:selection="data">
            {{ data.item.firstName }} {{ data.item.lastName }}
          </template>
        </v-select>

        <v-btn color="primary" @click="addGroup"> צור שיעור </v-btn>
      </v-form>
    </v-col>
    <v-col> </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mdiAccountOutline, mdiRenameBox } from "@mdi/js";
import {
  collection,
  getFirestore,
  addDoc,
  FirestoreError,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { Emit } from "vue-property-decorator";
import UserRoles from "@/enums/userRoles";
import { getUsersWithRoleBiggerThan } from "@/DAL/user.dal";
import User from "@/models/user";

@Component({ name: "AddUser" })
export default class AddUser extends Vue {
  valid = true;

  teachers: User[] = [];

  name = "";
  teacher: User | undefined = undefined;

  rules = {
    nameRules: [(value: string) => Boolean(value) || "יש להכניס שם"],
  };

  icons = {
    mdiAccountOutline,
    mdiRenameBox,
  };

  async created() {
    this.teachers = await getUsersWithRoleBiggerThan(UserRoles.TEACHER);
  }

  @Emit("add-group")
  async addGroup() {
    if (!(this.$refs.form as Vue & { validate: () => boolean }).validate())
      return false;

    try {
      Swal.showLoading();
      const doc = await addDoc(collection(getFirestore(), "groups"), {
        name: this.name,
        teacher: this.teacher?.uid,
      });
      Swal.hideLoading();
      Swal.fire({ title: "השיעור נוסף", icon: "success" });

      return { id: doc.id, name: this.name, teacher: this.teacher };
    } catch (error: unknown) {
      Swal.hideLoading();
      if (error instanceof FirestoreError) {
        let message = "";
        switch (error.code) {
          case "permission-denied":
          case "unauthenticated":
            message = "אין לך הרשאה לבצע את הפעולה הזאת";
            break;
          default:
            message = "קרתה תקלה. פנה לתמיכה";
            break;
        }

        Swal.fire({
          title: "לא היה ניתן להוסיף את השיעור",
          text: message,
          icon: "error",
        });
      }
    }

    return false;
  }
}
</script>
