const { join, resolve } = require('path');
const { readFileSync } = require('fs');
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import elementPlus from 'vite-plugin-element-plus';
import i18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    elementPlus({
      // if you need to use the *.scss source file, you need to uncomment this comment
      // useSource: true
      // format: mode === 'development' ? 'esm' : 'cjs',
    }),
    i18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths!
      include: resolve(__dirname, './i18n/**'),
    }),
  ],
  server: {
    https: {
      key: readFileSync(join(__dirname, '../ssl/ssl.key')),
      cert: readFileSync(join(__dirname, '../ssl/ssl.crt')),
    },
    port: 3080,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // example : additionalData: `@import "./src/design/styles/variables";`
        // dont need include file extend .scss
        additionalData: `@import "./src/scss/element-plus";`,
      },
    },
  },
});
