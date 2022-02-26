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
                  :loading="isLoadingTutors"
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
        <v-autocomplete
          chips
          deletable-chips
          multiple
          label="תלמידים להוספה"
          v-model="studentsToAdd"
          item-value="uid"
          :items="students"
          :loading="isLoadingStudents"
          :filter="searchStudent"
          style="width: 50%; align-self: center"
        >
          <template v-slot:selection="student">
            <v-chip
              v-bind="student.attrs"
              close
              @click="student.select"
              @click:close="removeStudentFromSelection(student.item)"
            >
              {{ student.item.firstName }} {{ student.item.lastName }}
            </v-chip>
          </template>
          <template v-slot:item="{ item, attrs, on }">
            <v-list-item v-on="on" v-bind="attrs" #default="{ active }">
              <v-list-item-action>
                <v-checkbox :input-value="active"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>
                {{ item.firstName }} {{ item.lastName }}
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-slot:append-outer>
            <v-btn
              elevation="2"
              color="primary"
              @click="addStudents"
              :loading="isAddingStudents"
            >
              הוספת תלמידים נבחרים
            </v-btn>
          </template>
        </v-autocomplete>
        <v-chip-group v-for="status in statuses" :key="status" column>
          <v-col cols="2" align-self="center">
            <h2>{{ statusLabel(status) }}:</h2>
          </v-col>
          <v-divider vertical></v-divider>
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
import StudentStatus from "@/enums/studentStatus";
import User from "@/models/user";
import UserRole from "@/enums/userRoles";
import { mdiCheck, mdiDotsVertical, mdiPencil } from "@mdi/js";
import Vue from "vue";
import Component from "vue-class-component";
import { Emit, Prop, Watch } from "vue-property-decorator";
import {
  getUsersWithRole,
  getUsersWithRoleAndExclude,
  getUsersWithRoleBiggerThan,
} from "@/DAL/user.dal";
import { addStudentsToLesson } from "@/DAL/lesson.dal";
import Swal from "sweetalert2";

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
  students: User[] = [];
  studentsToAdd: string[] = [];

  isLoadingTutors = true;
  isLoadingStudents = true;

  isAddingStudents = false;

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

  created() {
    this.getTutors();
  }

  async getTutors() {
    this.isLoadingTutors = true;

    this.tutors = await getUsersWithRoleBiggerThan(UserRole.TUTOR);

    this.isLoadingTutors = false;
  }

  @Watch("selectedEvent")
  async getStudents() {
    this.isLoadingStudents = true;

    if (this.selectedEvent.students.length > 0) {
      this.students = await getUsersWithRoleAndExclude(
        UserRole.STUDENT,
        this.selectedEvent.students.map((student) => student.student!.uid)
      );
    } else {
      this.students = await getUsersWithRole(UserRole.STUDENT);
    }

    this.isLoadingStudents = false;
  }

  removeStudentFromSelection(studentToRemove: User) {
    this.studentsToAdd = this.studentsToAdd.filter(
      (student) => student !== studentToRemove.uid
    );
  }

  async addStudents() {
    this.isAddingStudents = true;

    try {
      const added = await addStudentsToLesson(
        this.selectedEvent.id,
        this.studentsToAdd
      );
      this.cleanStudentLeftover(added);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "לא הצלחנו להוסיף את התלמידים.",
        text: err,
      });
    } finally {
      this.isAddingStudents = false;
    }
  }

  private cleanStudentLeftover(
    added: { student: string; status: StudentStatus }[]
  ) {
    this.studentsToAdd = [];
    this.selectedEvent.students.push(
      ...added.map((value) => {
        return {
          student: this.students.find(
            (student) => student.uid === value.student
          ),
          status: value.status,
        };
      })
    );
    this.students = this.students.filter(
      (student) =>
        !this.selectedEvent.students.find(
          (existingStudent) => existingStudent.student?.uid === student.uid
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

  searchStudent(student: User, searchValue: string) {
    return (
      (student.firstName.includes(searchValue) ||
        student.lastName.includes(searchValue)) &&
      !this.selectedEvent.isStudentInLesson(student.uid)
    );
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
