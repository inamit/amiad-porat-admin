import { createDirectStore } from "direct-vuex";
import Vue from "vue";
import Vuex from "vuex";
import { User } from "../api/models/user";
// import user from "./modules/user";

Vue.use(Vuex);

const { store, rootActionContext, moduleActionContext } = createDirectStore({
  modules: {
    // user,
  },
});

export default store;

export { rootActionContext, moduleActionContext };

export type AppStore = typeof store;
declare module "vuex" {
  interface Store<S> {
    direct: AppStore;
  }
}
