import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const { join } = require('path');
const { readFileSync } = require('fs');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: readFileSync(join(__dirname, '../ssl/ssl.key')),
      cert: readFileSync(join(__dirname, '../ssl/ssl.crt')),
    },
    port: 3080,
  },
});
