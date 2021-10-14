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
      <nav-menu-section-title title="פעולות חשבון" />
      <nav-menu-link
        title="Account Settings"
        :to="{ name: 'pages-account-settings' }"
        :icon="icons.mdiAccountCogOutline"
      />
      <nav-menu-section-title title="פעולות על משתמשים" />
      <nav-menu-link
        title="הוספת חשבון"
        :to="{ name: 'addAccount' }"
        :icon="icons.mdiAccountPlusOutline"
      />
      <nav-menu-group title="Pages" :icon="icons.mdiFileOutline">
        <nav-menu-link
          title="Login"
          :to="{ name: 'pages-login' }"
          target="_blank"
        />
        <nav-menu-link
          title="Register"
          :to="{ name: 'pages-register' }"
          target="_blank"
        />
        <nav-menu-link
          title="Error"
          :to="{ name: 'error-404' }"
          target="_blank"
        />
      </nav-menu-group>
      <nav-menu-section-title title="USER INTERFACE" />
      <nav-menu-link
        title="Typography"
        :to="{ name: 'typography' }"
        :icon="icons.mdiAlphaTBoxOutline"
      />
      <nav-menu-link
        title="Icons"
        :to="{ name: 'icons' }"
        :icon="icons.mdiEyeOutline"
      />
      <nav-menu-link
        title="Cards"
        :to="{ name: 'cards' }"
        :icon="icons.mdiCreditCardOutline"
      />
      <nav-menu-link
        title="Tables"
        :to="{ name: 'simple-table' }"
        :icon="icons.mdiTable"
      />
      <nav-menu-link
        title="Form Layouts"
        :to="{ name: 'form-layouts' }"
        :icon="icons.mdiFormSelect"
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
    mdiAlphaTBoxOutline,
    mdiEyeOutline,
    mdiCreditCardOutline,
    mdiTable,
    mdiFileOutline,
    mdiFormSelect,
    mdiAccountCogOutline,
    mdiAccountPlusOutline,
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
