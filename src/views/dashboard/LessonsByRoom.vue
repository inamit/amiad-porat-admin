<template>
  <v-card>
    <v-card-title class="align-start">
      <span>התגבורים היום</span>

      <v-spacer />

      <v-btn icon small class="me-n3 mt-n2" @click="printTable()">
        <v-icon>
          {{ icons.mdiPrinter }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-skeleton-loader
        v-if="isLoading"
        type="table-thead, table-row-divider@8"
      ></v-skeleton-loader>

      <v-simple-table
        id="lessonsByRoom"
        v-if="!isLoading && lessons && lessons.length > 0"
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th>שעה/חדר</th>
              <th
                v-for="room in rooms"
                style="text-align: center"
                :key="room.id"
              >
                {{ room.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hour in hours" :key="hour">
              <th>{{ hour }}</th>
              <td v-for="room in rooms" :key="room.id">
                <template
                  v-for="scope in [{ lesson: getLesson(hour, room.id) }]"
                >
                  <div v-if="scope.lesson" v-bind:key="scope.lesson.id">
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th style="text-align: center" colspan="3">
                              מתרגל:
                              {{ scope.lesson.tutor.firstName }}
                              {{ scope.lesson.tutor.lastName }}
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          v-if="getScheduledStudents(scope.lesson).length > 0"
                        >
                          <tr
                            v-for="student in getScheduledStudents(
                              scope.lesson
                            )"
                            :key="student.student"
                          >
                            <td>
                              {{ student.student.firstName }}
                              {{ student.student.lastName }}
                            </td>
                            <td>
                              <v-btn
                                icon
                                @click="
                                  setStudentStatus(
                                    scope.lesson.id,
                                    student.student.uid,
                                    student.status,
                                    StudentStatus.Arrived
                                  )
                                "
                                ><v-icon
                                  :color="
                                    student.status === StudentStatus.Arrived
                                      ? 'rgba(0,255,0,1)'
                                      : 'grey'
                                  "
                                  >{{ icons.mdiCheck }}</v-icon
                                ></v-btn
                              >
                            </td>
                            <td>
                              <v-btn
                                icon
                                @click="
                                  setStudentStatus(
                                    scope.lesson.id,
                                    student.student.uid,
                                    student.status,
                                    StudentStatus.Missed
                                  )
                                "
                                ><v-icon
                                  :color="
                                    student.status === StudentStatus.Missed
                                      ? 'rgba(255,0,0,1)'
                                      : 'grey'
                                  "
                                  >{{ icons.mdiClose }}</v-icon
                                ></v-btn
                              >
                            </td>
                          </tr>
                        </tbody>
                        <tbody v-else>
                          <tr>
                            <td>אין תלמידים</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </div>
                  <div v-else v-bind:key="scope.lesson">-</div>
                </template>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <h1 v-else>אין היום תגבורים</h1>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { changeStudentStatus, getAllLessonsBetween } from "@/DAL/lesson.dal";
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiDotsVertical,
  mdiPrinter,
  mdiCheck,
  mdiClose,
} from "@mdi/js";
import Vue from "vue";
import Component from "vue-class-component";
import Lesson from "@/models/lesson";
import Room from "@/models/room";
import { getAllRooms } from "@/DAL/room.dal";
import StudentStatus from "@/enums/studentStatus";
import Group from "@/models/group";
import { getAllGroups, getGroupsByDay } from "@/DAL/group.dal";

@Component({})
export default class LessonsByRoom extends Vue {
  icons = {
    mdiDotsVertical,
    mdiChevronUp,
    mdiChevronDown,
    mdiPrinter,
    mdiCheck,
    mdiClose,
  };

  isLoading = false;

  lessons: Lesson[] = [];
  rooms: Room[] = [];
  hours: string[] = [];
  groups: Group[] = [];

  StudentStatus = StudentStatus;

  async created() {
    this.isLoading = true;

    this.rooms = await getAllRooms();
    await this.getLessons();
    this.hours = this.lessons.map((lesson) =>
      lesson.start.toLocaleTimeString("default", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    this.isLoading = false;
  }

  async getLessons() {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.lessons = await getAllLessonsBetween(today, tomorrow);
    this.lessons = this.lessons.sort(
      (first, second) => first.start.getTime() - second.start.getTime()
    );
  }

  // async getGroups() {
  //   const today = new Date();
  //   this.groups = await getGroupsByDay(today.getDay());

  //   this.lessons.push(
  //     ...this.groups.map((group) => {
  //       const date = new Date();

  //       date.setHours(parseInt(group.hour));
  //       return new Lesson(
  //         group.id,
  //         date,
  //         true,
  //         group.teacher,
  //         [],
  //         group.subject
  //       );
  //     })
  //   );
  // }

  getLesson(date: string, roomId: string) {
    return this.lessons.find(
      (lesson) =>
        lesson.start.getHours().toString() === date.split(":")[0] &&
        lesson.room?.id === roomId
    );
  }

  getScheduledStudents(lesson: Lesson) {
    return lesson.students.filter(
      (student) =>
        student.status === StudentStatus.Scheduled ||
        student.status === StudentStatus.Arrived ||
        student.status === StudentStatus.Missed
    );
  }

  printTable() {
    const tableToPrint = document.getElementById("lessonsByRoom")!.outerHTML;
    const originalContents = document.body.innerHTML;

    document.body.outerHTML = `<body dir="rtl">${tableToPrint}</body>`;

    window.print();

    document.body.innerHTML = `<body>${originalContents}</body>`;
  }

  async setStudentStatus(
    lessonId: string,
    uid: string,
    oldStatus: StudentStatus,
    newStatus: StudentStatus
  ) {
    await changeStudentStatus(lessonId, uid, oldStatus, newStatus);

    this.lessons
      .find((lesson) => lesson.id === lessonId)!
      .students.find((student) => student.student?.uid === uid)!.status =
      newStatus;
  }
}
</script>
