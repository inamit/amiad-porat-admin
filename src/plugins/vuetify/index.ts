import Vue from "vue";
import Vuetify from "vuetify/lib";
import preset from "./default-preset/preset";
import he from "vuetify/src/locale/he";

Vue.use(Vuetify);

export default new Vuetify({
  preset,
  lang: {
    locales: { he },
    current: "he",
  },
  icons: {
    iconfont: "mdiSvg",
  },
  theme: {
    options: {
      customProperties: true,
      variations: false,
    },
  },
  rtl: true,
});
