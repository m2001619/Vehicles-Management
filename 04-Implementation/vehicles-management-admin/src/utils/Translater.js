// I18next Packages
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Languages' Files
import { en } from '../constans/Languages/English';
import { tr } from '../constans/Languages/Turkish';
import { ar } from '../constans/Languages/Arabic';

const lng = localStorage.getItem('lng') ? localStorage.getItem('lng') : 'en';
export const initI18Next = i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng,
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en
    },
    tr: {
      translation: tr
    },
    ar: {
      translation: ar
    }
  }
});
