import "@arco-design/web-vue/dist/arco.css";

import "./style.css";

import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";

import App from "./App.vue";

import { mapLocal } from "./utils/language";

/* 语言包 */
import en from "./locales/en.json";
import zh_Hans from "./locales/zh-Hans.json";
import zh_Hant from "./locales/zh-Hant.json";

const messages = {
    "en": en,
    "zh-Hans": zh_Hans,
    "zh-Hant": zh_Hant,
};

const locale = mapLocal(navigator.language, messages);
const fallbackLocale = "en";

const i18n = createI18n({
    locale, // set locale
    fallbackLocale, // set fallback locale
    messages,
});

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
