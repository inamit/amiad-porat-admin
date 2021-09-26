<template>
  <v-app>
    <vertical-nav-menu :is-drawer-open.sync="isDrawerOpen" />

    <v-app-bar app flat absolute color="transparent">
      <div class="boxed-container w-full">
        <div class="d-flex align-center mx-6">
          <!-- Left Content -->
          <v-app-bar-nav-icon
            class="d-block d-lg-none me-2"
            @click="isDrawerOpen = !isDrawerOpen"
          />
          <v-text-field
            rounded
            dense
            outlined
            :prepend-inner-icon="icons.mdiMagnify"
            class="app-bar-search flex-grow-0"
            hide-details
          />

          <v-spacer />

          <!-- Right Content -->
          <theme-switcher />
          <v-btn icon small class="ms-3">
            <v-icon>
              {{ icons.mdiBellOutline }}
            </v-icon>
          </v-btn>
          <app-bar-user-menu />
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <div class="app-content-container boxed-container pa-6">
        <slot />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import VerticalNavMenu from "./components/vertical-nav-menu/VerticalNavMenu.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import AppBarUserMenu from "./components/AppBarUserMenu.vue";
import { mdiMagnify, mdiBellOutline } from "@mdi/js";
import { ref } from "@vue/composition-api";

@Component({
  components: { VerticalNavMenu, ThemeSwitcher, AppBarUserMenu },
  name: "ContentTemplate",
})
export default class Template extends Vue {
  isDrawerOpen = false;
  icons = {
    mdiMagnify,
    mdiBellOutline,
  };
  // setup() {
  //   const isDrawerOpen = ref(null);

  //   return {
  //     isDrawerOpen,
  //     icons: {
  //       mdiMagnify,
  //       mdiBellOutline,
  //     },
  //   };
  // }
}
</script>

<style lang="scss" scoped>
.v-app-bar ::v-deep {
  .v-toolbar__content {
    padding: 0;

    .app-bar-search {
      .v-input__slot {
        padding-left: 18px;
      }
    }
  }
}

.boxed-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}
</style>
