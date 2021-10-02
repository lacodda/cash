import { createI18n } from 'vue-i18n'

import en from "./lang/en.ts";
import ru from "./lang/ru.ts";
import es from "./lang/es.ts";

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: "ru", // set locale
  fallbackLocale: "en", // set fallback locale
  messages: {
    en,
    ru,
    es,
  },
});

export default i18n;
