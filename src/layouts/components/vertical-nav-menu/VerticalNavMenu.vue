<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="(val) => $emit('update:is-drawer-open', val)"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <v-img
          :src="require('@/assets/images/logos/amiad_logo_transparent.png')"
          max-height="70px"
          max-width="70px"
          alt="logo"
          contain
          eager
          class="app-logo me-3"
        />
        <v-slide-x-transition>
          <h2 class="app-title text--primary">עמיעד פורת</h2>
        </v-slide-x-transition>
      </router-link>
    </div>

    <!-- Navigation Items -->
    <v-list expand shaped class="vertical-nav-menu-items pr-5">
      <nav-menu-link
        title="דף הבית"
        :to="{ name: 'dashboard' }"
        :icon="icons.mdiHomeOutline"
      />
      <!-- <nav-menu-section-title title="פעולות חשבון" /> -->
      <nav-menu-section-title title="פעולות על משתמשים" />
      <nav-menu-link
        exact
        title="כל המשתמשים"
        :to="{ name: 'listUsers' }"
        :icon="icons.mdiFilterVariant"
      />
      <nav-menu-link
        title="הוספת חשבון"
        :to="{ name: 'addAccount' }"
        :icon="icons.mdiAccountPlusOutline"
      />
      <nav-menu-section-title title="ניהול" />
      <nav-menu-link
        title="קבוצות"
        :to="{ name: 'listGroups' }"
        :icon="icons.mdiAccountGroup"
      />
      <nav-menu-link
        title="תגבורים"
        :to="{ name: 'listLessons' }"
        :icon="icons.mdiGoogleClassroom"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
// eslint-disable-next-line object-curly-newline
import {
  mdiHomeOutline,
  mdiAlphaTBoxOutline,
  mdiEyeOutline,
  mdiCreditCardOutline,
  mdiTable,
  mdiFileOutline,
  mdiFormSelect,
  mdiAccountCogOutline,
  mdiAccountPlusOutline,
  mdiAccountGroup,
  mdiFilterVariant,
  mdiGoogleClassroom,
} from "@mdi/js";
import NavMenuSectionTitle from "./components/NavMenuSectionTitle.vue";
import NavMenuGroup from "./components/NavMenuGroup.vue";
import NavMenuLink from "./components/NavMenuLink.vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "VerticalNavMenu",
  components: {
    NavMenuSectionTitle,
    NavMenuGroup,
    NavMenuLink,
  },
})
export default class VerticalNavMenu extends Vue {
  @Prop({ default: null }) private isDrawerOpen!: boolean;

  icons = {
    mdiHomeOutline,
    mdiAccountGroup,
    mdiAlphaTBoxOutline,
    mdiEyeOutline,
    mdiCreditCardOutline,
    mdiTable,
    mdiFileOutline,
    mdiFormSelect,
    mdiAccountCogOutline,
    mdiAccountPlusOutline,
    mdiFilterVariant,
    mdiGoogleClassroom,
  };
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;
  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, "background");
}

.app-navigation-menu {
  .v-list-item {
    text-align: start;
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}
</style>
