<template>
  <div id="app">
    <component :is="resolveLayout">
      <router-view />
    </component>

    <div class="text-center ma-2" dir="rtl">
      <v-snackbar v-model="newVersionSnackBar" :timeout="-1">
        יש גרסה חדשה. בכדי לראות אותה יש לרענן את הדף.

        <template v-slot:action="{ attrs }">
          <v-btn icon v-bind="attrs" @click="refreshPage">
            <v-icon color="pink">{{ icons.mdiRefresh }}</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LayoutContent from "./layouts/ContentTemplate.vue";
import LayoutBlank from "./layouts/BlankTemplate.vue";
import { mdiRefresh } from "@mdi/js";

@Component({ components: { LayoutContent, LayoutBlank } })
export default class App extends Vue {
  newVersionSnackBar = false;

  icons = { mdiRefresh };

  get resolveLayout() {
    const route = this.$route;

    if (route.name === null) return null;

    if (route.meta!.layout === "blank") return "layout-blank";

    return "layout-content";
  }

  created() {
    window.addEventListener("has-new-version", (event) => {
      this.setNewVersionSnackBar(true);
    });
  }

  setNewVersionSnackBar(isOpen: boolean) {
    this.newVersionSnackBar = isOpen;
  }

  refreshPage() {
    document.location.reload();
  }
}
</script>
<style>
@import "~gleap/build/index.min.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
