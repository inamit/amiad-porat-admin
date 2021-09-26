<template>
  <v-fade-transition mode="out-in">
    <v-icon
      :key="$vuetify.theme.dark"
      @click="$vuetify.theme.dark = !$vuetify.theme.dark"
    >
      {{ $vuetify.theme.dark ? icons.mdiWeatherSunny : icons.mdiWeatherNight }}
    </v-icon>
  </v-fade-transition>
</template>

<script>
import { mdiWeatherNight, mdiWeatherSunny } from "@mdi/js";
import Vue from "vue";
import Component from "vue-class-component";

@Component({ name: "ThemeSwitcher" })
export default class ThemeSwitcher extends Vue {
  icons = {
    mdiWeatherNight,
    mdiWeatherSunny,
  };
}
</script>

<style></style>
