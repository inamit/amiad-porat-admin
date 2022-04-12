const { mergeSassVariables } = require("@vuetify/cli-plugin-utils");

module.exports = {
  devServer: {
    port: 8080,
    host: "0.0.0.0",
  },
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    const modules = ["vue-modules", "vue", "normal-modules", "normal"];
    modules.forEach((match) => {
      config.module
        .rule("sass")
        .oneOf(match)
        .use("sass-loader")
        .tap((opt) => mergeSassVariables(opt, "'@/styles/variables.scss'"));
      config.module
        .rule("scss")
        .oneOf(match)
        .use("sass-loader")
        .tap((opt) => mergeSassVariables(opt, "'@/styles/variables.scss';"));
    });
  },
};
