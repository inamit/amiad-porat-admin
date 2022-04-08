<template>
  <v-card>
    <v-card-title class="align-start">
      <span>תלמידים שלא קבעו תגבור לשבוע הקרוב</span>

      <v-spacer />

      <v-btn icon small class="me-n3 mt-n2">
        <v-icon>
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-list class="pb-0">
        <v-list-item
          v-for="(data, index) in students"
          :key="data.uid"
          :class="`d-flex align-center px-0 ${index > 0 ? 'mt-4' : ''}`"
        >
          <div>
            <h4 class="font-weight-semibold">
              {{ data.firstName }} {{ data.lastName }}
            </h4>
          </div>

          <v-spacer />

          <div>
            <h4 class="font-weight-semibold">
              <a
                :href="`https://wa.me/${data.phoneNo}?text=${whatsappMessageDefault}`"
                target="_blank"
              >
                {{ data.phoneNo }}
              </a>
            </h4>
          </div>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { getAllStudentsBetween } from "@/DAL/lesson.dal";
import { getUsersWithRole } from "@/DAL/user.dal";
import UserRole from "@/enums/userRoles";
import User from "@/models/user";
import { mdiChevronDown, mdiChevronUp, mdiDotsVertical } from "@mdi/js";
import Vue from "vue";
import Component from "vue-class-component";
import { getString, getRemoteConfig } from "firebase/remote-config";

@Component({})
export default class UnscheduledStudents extends Vue {
  icons = {
    mdiDotsVertical,
    mdiChevronUp,
    mdiChevronDown,
  };

  students: User[] = [];

  whatsappMessageDefault = getString(
    getRemoteConfig(),
    "unscheduledStudentWhatsappMessage"
  );

  created() {
    this.getUnscheduledStudents();
  }

  async getUnscheduledStudents() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    const scheduledStudents: string[] = await getAllStudentsBetween(
      new Date(),
      endDate
    );

    try {
      this.students = await getUsersWithRole(UserRole.STUDENT);
      this.students = this.students.filter(
        (student) => !scheduledStudents.includes(student.uid)
      );
    } catch (e) {
      console.log(e);
    }
  }
}
</script>
