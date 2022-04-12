<template>
  <v-data-table
    :headers="headers"
    :items="groups"
    item-key="id"
    class="table-rounded"
    :loading="loading"
    loading-text="טוען..."
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>שיעורים</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              הוספת שיעור
            </v-btn>
          </template>
          <v-card>
            <v-card-text
              ><add-group @add-group="close"></add-group
            ></v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.name`]="{ item }">
      <div class="d-flex flex-column">
        <span
          class="d-block font-weight-semibold text--primary text-truncate"
          >{{ item.name }}</span
        >
      </div>
    </template>
    <template #[`item.teacher`]="{ item }">
      <div class="d-flex flex-column">
        <span
          class="d-block font-weight-semibold text--primary text-truncate"
          >{{ `${item.teacher.firstName} ${item.teacher.lastName}` }}</span
        >
      </div>
    </template>
    <template #[`item.subject`]="{ item }">
      <div class="d-flex flex-column">
        <span
          class="d-block font-weight-semibold text--primary text-truncate"
          >{{ subjects[item.subject] }}</span
        >
      </div>
    </template>
    <template #[`item.day`]="{ item }">
      <div class="d-flex flex-column">
        <span
          class="d-block font-weight-semibold text--primary text-truncate"
          >{{ days[item.day] }}</span
        >
      </div>
    </template>
    <template #[`item.hour`]="{ item }">
      <div class="d-flex flex-column">
        <span
          class="d-block font-weight-semibold text--primary text-truncate"
          >{{ item.hour }}</span
        >
      </div>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon @click="deleteGroup(item)" color="rgba(255,0,0,1)">
        {{ icons.mdiDelete }}
      </v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "@firebase/firestore";
import Vue from "vue";
import Component from "vue-class-component";
import AddGroup from "../add-group/AddGroup.vue";
import { mdiPencil, mdiDelete } from "@mdi/js";
import Swal from "sweetalert2";
import Group from "@/models/group";
import { getAllGroups } from "@/DAL/group.dal";

@Component({ name: "AllGroups", components: { AddGroup } })
export default class AllGroups extends Vue {
  groups: Group[] = [];

  loading = true;

  headers = [
    { text: "שם השיעור", value: "name" },
    { text: "מורה", value: "teacher" },
    { text: "מקצוע", value: "subject" },
    { text: "יום", value: "day" },
    { text: "שעה", value: "hour" },
    { text: "", value: "actions", align: "left" },
  ];

  days = {
    7: "ראשון",
    1: "שני",
    2: "שלישי",
    3: "רביעי",
    4: "חמישי",
    5: "שישי",
    6: "שבת",
  };

  subjects = {
    math: "מתמטיקה",
    english: "אנגלית",
  };

  dialog = false;

  icons = { mdiPencil, mdiDelete };

  async created() {
    this.getGroups();
  }

  async getGroups() {
    this.loading = true;

    this.groups = await getAllGroups();

    this.loading = false;
  }

  async deleteGroup(group: any) {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "אתה בטוח שברצונך למחוק את השיעור הזה?",
      confirmButtonText: "כן",
      cancelButtonText: "לא",
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (!isConfirmed) return false;

    try {
      await deleteDoc(doc(getFirestore(), "groups", group.id));
    } catch (error: any) {
      Swal.fire({ icon: "error", text: error, title: "לא ניתן למחוק" });
    }
    this.getGroups();
  }

  async close(value: any) {
    if (value instanceof Object) {
      this.groups.push({
        id: value.id,
        name: value.name,
        teacher: value.teacher,
        subject: value.subject,
        day: value.dayInWeek,
        hour: value.hour,
      });
    }

    this.dialog = false;
  }
}
</script>
