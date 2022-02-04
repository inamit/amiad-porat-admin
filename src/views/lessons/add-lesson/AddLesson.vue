<template>
  <v-row justify="center">
    <v-col> </v-col>
    <v-col cols="7">
      <h1>יצירת תגבור חדש</h1>
      <br />
      <v-form v-model="valid" ref="form">
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="תאריך התגבור"
              :prepend-icon="icons.mdiCalendar"
              readonly
              v-bind="attrs"
              v-on="on"
              :rules="rules.dateRule"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            @input="dateMenu = false"
          ></v-date-picker>
        </v-menu>
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
              label="שעת התגבור"
              :prepend-icon="icons.mdiClockTimeFourOutline"
              v-bind="attrs"
              v-on="on"
              :rules="rules.timeRule"
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
        <v-radio-group v-model="subject" row>
          <v-radio label="מתמטיקה" value="math"></v-radio>
          <v-radio label="אנגלית" value="english"></v-radio>
        </v-radio-group>
        <v-select
          v-model="tutor"
          placeholder="מתרגל"
          item-value="uid"
          :items="tutors"
        >
          <template v-slot:item="data">
            {{ data.item.firstName }} {{ data.item.lastName }}
          </template>
          <template v-slot:selection="data">
            {{ data.item.firstName }} {{ data.item.lastName }}
          </template>
        </v-select>
        <v-text-field
          type="number"
          label="מספר מקסימלי של תלמידים"
          v-model="maxStudents"
        >
        </v-text-field>
        <v-btn color="primary" @click="addLesson"> צור תגבור </v-btn>
      </v-form>
    </v-col>
    <v-col> </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mdiClockTimeFourOutline, mdiCalendar } from "@mdi/js";
import {
  collection,
  getFirestore,
  addDoc,
  FirestoreError,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { Emit, Watch } from "vue-property-decorator";
import { string } from "joi";
import UserRole from "@/models/userRoles";

@Component({ name: "AddLesson" })
export default class AddLesson extends Vue {
  valid = true;

  timeMenu = false;
  time = "";

  dateMenu = false;
  date: string | null = null;

  subject = "math";
  tutor = "";

  maxStudents = 5;

  tutors: Record<string, any>[] = [];

  rules = {
    timeRule: [(value: any) => Boolean(value) || "יש לבחור שעה"],
    dateRule: [(value: any) => Boolean(value) || "יש לבחור תאריך"],
  };

  icons = {
    mdiClockTimeFourOutline,
    mdiCalendar,
  };

  async created() {
    const tutorsQuery = query(
      collection(getFirestore(), "users"),
      where("role", ">=", UserRole.TUTOR)
    );
    const tutorsDocs = await getDocs(tutorsQuery);

    tutorsDocs.forEach((doc) =>
      this.tutors.push({ uid: doc.id, ...doc.data() })
    );
  }

  @Emit("add-lesson")
  async addLesson() {
    if (!(this.$refs.form as Vue & { validate: () => boolean }).validate())
      return false;

    try {
      Swal.showLoading();
      const lessonDate = new Date(this.date!);
      lessonDate.setHours(
        parseInt(this.time.split(":")[0]),
        parseInt(this.time.split(":")[1])
      );

      const lessonData = {
        date: lessonDate,
        subject: this.subject,
        tutor: this.tutor,
        maxStudents: this.maxStudents,
        students: [],
        isOpen: false,
      };
      const doc = await addDoc(
        collection(getFirestore(), "lessons"),
        lessonData
      );

      Swal.hideLoading();
      Swal.fire({ title: "התגבור נוסף", icon: "success" });

      return { id: doc.id, ...lessonData };
    } catch (error: unknown) {
      console.log(error);
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
          title: "לא היה ניתן להוסיף את התגבור",
          text: message,
          icon: "error",
        });
      }
    }

    return false;
  }
}
</script>
