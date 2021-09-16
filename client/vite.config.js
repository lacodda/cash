const { join, resolve } = require('path');
const { readFileSync } = require('fs');
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import elementPlus from 'vite-plugin-element-plus';
import i18n from '@intlify/vite-plugin-vue-i18n';

const envPrefix = 'CLIENT_';
const projectRoot = join(__dirname, '../');

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), envPrefix) };

  return defineConfig({
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
    envDir: projectRoot,
    envPrefix,
    server: {
      https: {
        key: readFileSync(resolve(projectRoot, './ssl/ssl.key')),
        cert: readFileSync(resolve(projectRoot, './ssl/ssl.crt')),
      },
      port: process.env.CLIENT_PORT || 3001,
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
};
