import "@arco-design/web-vue/dist/arco.css";

import "./style.css";

import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";

import App from "./App.vue";

import { init } from "./utils/language";

const i18n = init();

const app = createApp(App);
app.provide("i18n", i18n); // 提供全局依赖

// REF [应用实例 API | Vue.js](https://cn.vuejs.org/api/application.html#app-config-performance)
app.config.performance = true; // 启用开发模式的性能分析

app.use(i18n); // 国际化
app.use(ArcoVue); // Arco 组件库
app.use(ArcoVueIcon); // Arco 组件库图标

/* 添加 #app 元素 */
const id = "app";
globalThis.document.body.insertAdjacentHTML("beforeend", `<div id="${id}"></div>`);
app.mount(`#${id}`);
