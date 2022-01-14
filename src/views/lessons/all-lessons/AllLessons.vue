<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            היום
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              {{ icons.mdiChevronRight }}
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              {{ icons.mdiChevronLeft }}
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="addLessonDialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="ml-2" v-bind="attrs" v-on="on">
                הוספת תגבור
              </v-btn>
            </template>
            <v-card>
              <v-card-text
                ><add-lesson @add-lesson="close"></add-lesson
              ></v-card-text>
            </v-card>
          </v-dialog>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> {{ icons.mdiMenuDown }} </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>יומי</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>שבועי</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          event-overlap-mode="stack"
          :event-color="getEventColor"
          :event-timed="isTimed"
          :type="type"
          :locale="`he`"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="rangeChanged"
        >
          <template v-slot:day-body="{ date, week }">
            <div
              class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
          </template>
          <template v-slot:event="{ event }">
            <strong
              >{{ event.tutor.firstName }} {{ event.tutor.lastName }}</strong
            >
            <br />
            {{ event.start.getHours() }}-{{ event.end.getHours() }}
            <br />
          </template>
        </v-calendar>
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
                        v-model="selectedEvent.tutor"
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
                :label="
                  selectedEvent.isOpen ? 'פתוח לתלמידים' : 'סגור לתלמידים'
                "
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
              <v-btn
                text
                color="secondary"
                @click="
                  selectedOpen = false;
                  editingEvent = false;
                "
              >
                סגור (מבלי לשמור שינויים)
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiPencil,
  mdiDotsVertical,
  mdiMenuDown,
  mdiCheck,
} from "@mdi/js";
import {
  collection,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
} from "@firebase/firestore";
import Lesson from "@/models/lesson";
import User from "@/models/user";
import StudentStatus from "@/models/studentStatus";
import AddLesson from "@/views/lessons/add-lesson/AddLesson.vue";

@Component({ name: "AllLessons", components: { AddLesson } })
export default class AllLessons extends Vue {
  icons = {
    mdiChevronRight,
    mdiChevronLeft,
    mdiPencil,
    mdiDotsVertical,
    mdiMenuDown,
    mdiCheck,
  };

  statuses = Object.values(StudentStatus);

  statusLabel(status) {
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

  focus = "";
  type = "week";
  typeToLabel = {
    week: "שבועי",
    day: "יומי",
  };
  selectedEvent = { tutor: { firstName: "", lastName: "" }, students: [] };
  selectedElement = null;
  selectedOpen = false;
  events = [];
  start = null;
  end = null;

  tutors = [];

  ready = false;

  addLessonDialog = false;

  editingEvent = false;

  finishEditing() {
    this.selectedEvent.tutor = this.tutors.filter(
      (tutor) => tutor.uid === this.selectedEvent.tutor
    )[0];
    this.editingEvent = false;
  }

  viewDay({ date }) {
    this.focus = date;
    this.type = "day";
  }
  getEventColor(event) {
    return event.color;
  }
  isTimed(event) {
    return true;
  }
  setToday() {
    this.focus = "";
  }
  prev() {
    this.cal.prev();
  }
  next() {
    this.cal.next();
  }
  showEvent({ nativeEvent, event }) {
    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => (this.selectedOpen = true))
      );
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
      requestAnimationFrame(() => requestAnimationFrame(() => open()));
    } else {
      open();
    }

    nativeEvent.stopPropagation();
  }

  get cal() {
    return this.ready ? this.$refs.calendar : null;
  }

  async rangeChanged({ start, end }) {
    const startDate = new Date(start.date);
    const endDate = new Date(end.date);
    endDate.setHours(23);
    endDate.setMinutes(59);
    const q = query(
      collection(getFirestore(), "lessons"),
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );

    const querySnapshot = await getDocs(q);
    const lessons = [];

    querySnapshot.forEach(async (lesson) => {
      const tutor = await getDoc(
        doc(getFirestore(), "users", lesson.get("tutor"))
      );

      let tutorObj = null;
      if (tutor.exists()) {
        tutorObj = new User(
          tutor.id,
          tutor.get("firstName"),
          tutor.get("lastName")
        );
      }

      const students = lesson.get("students");

      const studentsObj = [];

      for (const student of students) {
        const studentFirestore = await getDoc(
          doc(getFirestore(), "users", student.student)
        );

        if (studentFirestore.exists()) {
          const studentObj = new User(
            studentFirestore.get("uid"),
            studentFirestore.get("firstName"),
            studentFirestore.get("lastName")
          );

          const objToPush = {
            student: studentObj,
            status: StudentStatus.Scheduled,
          };

          studentsObj.push(objToPush);
        }
      }

      const lessonObj = new Lesson(
        lesson.id,
        lesson.get("date").toDate(),
        lesson.get("isOpen"),
        tutorObj,
        studentsObj,
        lesson.get("subject")
      );

      lessons.push(lessonObj);
    });

    this.events = lessons;
  }

  async created() {
    const tutorsQuery = query(
      collection(getFirestore(), "users"),
      where("role", "==", "tutor")
    );
    const tutorsDocs = await getDocs(tutorsQuery);

    tutorsDocs.forEach((doc) =>
      this.tutors.push({ uid: doc.id, ...doc.data() })
    );
  }

  mounted() {
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
  }

  async close(value) {
    if (value instanceof Object) {
      this.events.push(value);
    }

    if (value !== false) {
      this.addLessonDialog = Boolean(value);
    }
  }

  // #region "NOW" red line
  get nowY() {
    return this.cal ? this.cal.timeToY(this.cal.times.now) + "px" : "-10px";
  }
  getCurrentTime() {
    return this.cal
      ? this.cal.times.now.hour * 60 + this.cal.times.now.minute
      : 0;
  }
  scrollToTime() {
    const time = this.getCurrentTime();
    const first = Math.max(0, time - (time % 30) - 30);

    this.cal.scrollToTime(first);
  }
  updateTime() {
    setInterval(() => this.cal.updateTimes(), 60 * 1000);
  }
  // #endregion
}
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: "";
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-right: -53%;
  }
}
</style>
