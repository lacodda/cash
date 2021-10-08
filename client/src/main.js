import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.ts';
import store from './store/index.ts';
import i18n from './i18n/index.ts';
import { ElLoading } from 'element-plus';

const app = createApp(App);
app.use(i18n);
app.use(store);
app.use(router);
app.use(ElLoading);
app.mount('#app');
