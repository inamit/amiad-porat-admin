<template>
  <div id="app">
    <component :is="resolveLayout">
      <router-view />
    </component>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <!-- <router-view /> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LayoutContent from "./layouts/ContentTemplate.vue";
import LayoutBlank from "./layouts/BlankTemplate.vue";
import { useRouter } from "@/utils";

@Component({ components: { LayoutContent, LayoutBlank } })
export default class App extends Vue {
  get resolveLayout() {
    const route = this.$route;

    if (route.name === null) return null;

    if (route.meta!.layout === "blank") return "layout-blank";

    return "layout-content";
  }
}
</script>
<style>
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
