<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="lessonsList"
      item-key="id"
      class="table-rounded"
      loading="isLoding"
      loading-text="טוען..."
      show-expand
    >
      <template #[`item.teacher`]="{ item }">
        <div class="d-flex flex-column">
          <span
            class="d-block font-weight-semibold text--primary text-truncate"
            >{{ `${item.teacher.first_name} ${item.teacher.last_name}` }}</span
          >
        </div>
      </template>

      <template #[`item.subject`]="{ item }">
        <div class="d-flex flex-column">
          <span
            class="d-block font-weight-semibold text--primary text-truncate"
            >{{ item.subject.name }}</span
          >
        </div>
      </template>
      <template #[`item.room`]="{ item }">
        <div class="d-flex flex-column">
          <span
            class="d-block font-weight-semibold text--primary text-truncate"
            >{{ item.room.name }}</span
          >
        </div>
      </template>
      <template #[`item.start_time`]="{ item }">
        <div class="d-flex flex-column">
          <span
            class="d-block font-weight-semibold text--primary text-truncate"
            >{{ new Date(item.start_time).toLocaleString() }}</span
          >
        </div>
      </template>
      <template #[`item.is_open`]="{ item }">
        <div class="d-flex flex-column">
          <v-checkbox readonly v-model="item.is_open"></v-checkbox>
        </div>
      </template>
      <template #[`item.student_no`]="{ item }">
        <div class="d-flex flex-column">
          <span
            class="d-block font-weight-semibold text--primary text-truncate"
            >{{
              item.students.filter((student) => student.status !== "cancelled")
                .length
            }}</span
          >
        </div>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <div v-for="student in item.students" :key="student.student.id">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  :color="colors[student.status]"
                  :style="`text-decoration: ${
                    student.status === 'cancelled' ? 'line-through' : ''
                  }`"
                  v-on="on"
                  v-bind="attrs"
                  >{{
                    `${student.student.first_name} ${student.student.last_name}`
                  }}</v-chip
                >
              </template>
              <span>{{ tooltip[student.status] }}</span>
            </v-tooltip>
          </div>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Lesson from "@/models/lesson";
import { mdiSquareEditOutline, mdiDotsVertical, mdiArrowDown } from "@mdi/js";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import data from "./datatable-data";

@Component({})
export default class DashboardDatatable extends Vue {
  headers = [
    { text: "מורה", value: "teacher" },
    { text: "מקצוע", value: "subject" },
    { text: "חדר", value: "room" },
    { text: "תאריך ושעה", value: "start_time" },
    { text: "פתוח", value: "is_open" },
    { text: "מספר תלמידים", value: "student_no" },
  ];
  private isLoading = true;
  private lessonsList: Array<Lesson> = [];
  private colors = {
    scheduled: "primary",
    cancelled: "#FF0000",
    arrived: "green",
    missed: "yellow",
  };

  private tooltip = {
    scheduled: "קבע/ה",
    cancelled: "ביטל/ה",
    arrived: "הגיע/ה",
    missed: "לא הגיע/ה",
  };

  async created() {
    this.isLoading = false;
  }

  getColor(status: string) {
    switch (status) {
      case "scheduled":
        break;
      case "cancelled":
        break;
      case "arrived":
        break;
      case "misswd":
        break;
      default:
        break;
    }
  }

  // icons
  icons = {
    mdiSquareEditOutline,
    mdiDotsVertical,
    mdiArrowDown,
  };
}
</script>
