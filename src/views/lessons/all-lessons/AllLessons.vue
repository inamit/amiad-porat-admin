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
          :event-color="getEventColor"
          :type="type"
          :locale="`he`"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>{{ icons.mdiPencil }}</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiPencil,
  mdiDotsVertical,
  mdiMenuDown,
} from "@mdi/js";

@Component({ name: "AllLessons" })
export default class AllLessons extends Vue {
  icons = {
    mdiChevronRight,
    mdiChevronLeft,
    mdiPencil,
    mdiDotsVertical,
    mdiMenuDown,
  };

  focus = "";
  type = "week";
  typeToLabel = {
    week: "שבועי",
    day: "יומי",
  };
  selectedEvent = {};
  selectedElement = null;
  selectedOpen = false;
  events = [];
  private start: any = null;
  private end: any = null;

  private get calendarInstance(): Vue & {
    prev: () => void;
    next: () => void;
    getFormatter: (format: any) => any;
  } {
    return this.$refs.calendar as Vue & {
      prev: () => void;
      next: () => void;
      getFormatter: (format: any) => any;
    };
  }

  setToday() {
    this.focus = "";
  }
  prev() {
    this.calendarInstance.prev();
  }
  next() {
    this.calendarInstance.next();
  }
  showEvent({ nativeEvent, event }: any) {
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
}
</script>
