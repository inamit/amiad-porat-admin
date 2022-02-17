<template>
  <v-dialog
    v-model="selectedOpen"
    :persistent="editingEvent"
    :activator="selectedElement"
  >
    <v-card flat>
      <v-toolbar :color="selectedEvent.color" dark>
        <v-btn v-if="!editingEvent" @click="editingEvent = true" icon>
          <v-icon>{{ icons.mdiPencil }}</v-icon>
        </v-btn>
        <v-btn v-if="editingEvent" @click="finishEditing()" icon>
          <v-icon>{{ icons.mdiCheck }}</v-icon>
        </v-btn>
        <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text style="display: flex; flex-direction: column">
        <h1 style="align-self: center">
          <table>
            <tr>
              <td><span class="ml-2">מתרגל:</span></td>
              <td v-if="!editingEvent">
                {{ selectedEvent.tutor.firstName }}
                {{ selectedEvent.tutor.lastName }}
              </td>
              <td v-if="editingEvent">
                <v-select
                  v-model="selectedTutor"
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
              </td>
            </tr>
          </table>
        </h1>
        <v-switch
          class="mt-5"
          style="align-self: center"
          :label="selectedEvent.isOpen ? 'פתוח לתלמידים' : 'סגור לתלמידים'"
          v-model="selectedEvent.isOpen"
          :readonly="!editingEvent"
          :color="selectedEvent.color"
        >
        </v-switch>
        <h1>תלמידים: {{ selectedEvent.students.length }}</h1>
        <v-chip-group v-for="status in statuses" :key="status" column>
          <v-col cols="2" align-self="center">
            <h2>{{ statusLabel(status) }}:</h2>
          </v-col>
          <v-col style="text-align: right">
            <v-chip
              v-for="student in selectedEvent.students.filter(
                (element) => element.status === status
              )"
              :key="student.student.uid"
            >
              {{ student.student.firstName }}
              {{ student.student.lastName }}
            </v-chip>
          </v-col>
        </v-chip-group>
        <span v-html="selectedEvent.details"></span>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="secondary" @click="closeLessonView">
          <span v-if="editingEvent">שמור ו</span>סגור
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Lesson from "@/models/lesson";
import StudentStatus from "@/models/studentStatus";
import User from "@/models/user";
import UserRole from "@/models/userRoles";
import { mdiCheck, mdiDotsVertical, mdiPencil } from "@mdi/js";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import Vue from "vue";
import Component from "vue-class-component";
import { Emit, Prop, Watch } from "vue-property-decorator";

@Component({ name: "ViewLesson" })
export default class ViewLesson extends Vue {
  @Prop()
  selectedElement = null;

  @Prop()
  selectedEvent: Lesson = Lesson.empty();

  @Prop()
  selectedOpen = false;

  editingEvent = false;
  tutors: User[] = [];

  selectedTutor = this.selectedEvent.tutor?.uid;

  statuses = Object.values(StudentStatus);

  statusLabel(status: StudentStatus) {
    switch (status) {
      case StudentStatus.Scheduled:
        return "קבעו";
      case StudentStatus.Canceled:
        return "ביטלו";
      case StudentStatus.Missed:
        return "לא הגיעו";
      case StudentStatus.Arrived:
        return "הגיעו";
    }
  }

  icons = {
    mdiPencil,
    mdiDotsVertical,
    mdiCheck,
  };

  async created() {
    const tutorsQuery = query(
      collection(getFirestore(), "users"),
      where("role", ">=", UserRole.TUTOR)
    );
    const tutorsDocs = await getDocs(tutorsQuery);

    tutorsDocs.forEach((doc) =>
      this.tutors.push(
        new User(doc.id, doc.get("firstName"), doc.get("lastName"))
      )
    );
  }

  finishEditing() {
    this.selectedEvent.tutor = this.tutors.find(
      (tutor) => tutor.uid === this.selectedTutor
    )!;

    //TODO: Change in firebase

    this.editingEvent = false;
  }

  @Emit("close-lesson-view")
  closeLessonView() {
    if (this.editingEvent) {
      this.finishEditing();
    }

    return !this.selectedOpen;
  }

  @Watch("selectedEvent")
  onSelectedEventChanged(value: Lesson) {
    this.selectedTutor = value.tutor?.uid;
  }
}
</script>
