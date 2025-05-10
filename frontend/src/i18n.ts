import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import tr from './locales/tr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr }
    },
    fallbackLng: 'en',
    debug: false,
    detection: {
      //gets from localStorage first, then cookies, then browser settings
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage'] //hope it saves detected/selected language in localStorage amen
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
