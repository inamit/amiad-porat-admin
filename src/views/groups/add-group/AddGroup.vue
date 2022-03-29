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
        <v-radio-group v-model="subject" row>
          <v-radio label="מתמטיקה" value="math"></v-radio>
          <v-radio label="אנגלית" value="english"></v-radio>
        </v-radio-group>
        <v-select
          :items="days"
          label="יום השיעור"
          item-text="value"
          item-value="key"
          v-model="day"
          outlined
          required
        >
        </v-select>
        <v-menu
          ref="menu"
          v-model="timeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="time"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time"
              label="שעת השיעור"
              :prepend-inner-icon="icons.mdiClockTimeFourOutline"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="timeMenu"
            v-model="time"
            full-width
            format="24hr"
            @click:minute="$refs.menu.save(time)"
          ></v-time-picker>
        </v-menu>

        <v-btn color="primary" @click="addGroup"> צור שיעור </v-btn>
      </v-form>
    </v-col>
    <v-col> </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  mdiAccountOutline,
  mdiRenameBox,
  mdiClockTimeFourOutline,
} from "@mdi/js";
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
  subject = "math";
  day = 0;
  time = "";

  rules = {
    nameRules: [(value: string) => Boolean(value) || "יש להכניס שם"],
  };

  icons = {
    mdiAccountOutline,
    mdiRenameBox,
    mdiClockTimeFourOutline,
  };

  days = [
    { key: 7, value: "ראשון" },
    { key: 1, value: "שני" },
    { key: 2, value: "שלישי" },
    { key: 3, value: "רביעי" },
    { key: 4, value: "חמישי" },
    { key: 5, value: "שישי" },
    { key: 6, value: "שבת" },
  ];

  timeMenu = false;

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
        subject: this.subject,
        dayInWeek: this.day,
        hour: this.time,
      });
      Swal.hideLoading();
      Swal.fire({ title: "השיעור נוסף", icon: "success" });

      return {
        id: doc.id,
        name: this.name,
        teacher: this.teacher,
        subject: this.subject,
        dayInWeek: this.day,
        hour: this.time,
      };
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
