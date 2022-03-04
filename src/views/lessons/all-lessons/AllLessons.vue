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
        <view-lesson
          :selectedOpen="selectedOpen"
          :selectedElement="selectedElement"
          :selectedEvent="selectedEvent"
          @close-lesson-view="closeLessonView"
        ></view-lesson>
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
import Lesson from "@/models/lesson";
import AddLesson from "@/views/lessons/add-lesson/AddLesson.vue";
import ViewLesson from "@/views/lessons/view-lesson/ViewLesson.vue";
import { getAllLessonsBetween } from "@/DAL/lesson.dal";

@Component({ name: "AllLessons", components: { AddLesson, ViewLesson } })
export default class AllLessons extends Vue {
  icons = {
    mdiChevronRight,
    mdiChevronLeft,
    mdiPencil,
    mdiDotsVertical,
    mdiMenuDown,
    mdiCheck,
  };

  focus = "";
  type = "week";
  typeToLabel = {
    week: "שבועי",
    day: "יומי",
  };
  selectedEvent = Lesson.empty(); // { tutor: { firstName: "", lastName: "" }, students: [] };
  selectedElement = null;
  selectedOpen = false;
  events = [];
  start = null;
  end = null;

  ready = false;

  addLessonDialog = false;

  closeLessonView(value) {
    this.selectedOpen = value;
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

    this.events = await getAllLessonsBetween(startDate, endDate);
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
