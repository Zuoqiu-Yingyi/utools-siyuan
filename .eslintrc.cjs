/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineConfig } = require('eslint-define-config');
module.exports = defineConfig({
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended",
    ],
    overrides: [
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parser: '@typescript-eslint/parser',
    },
    plugins: [
        "vue",
        "@typescript-eslint",
    ],
    rules: {
        "@typescript-eslint/ban-ts-comment": "off",
    },
});
