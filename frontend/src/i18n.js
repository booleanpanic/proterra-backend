import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import az from './translations/az.json';
import en from './translations/en.json';
import ru from './translations/ru.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            az: { translation: az },
            en: { translation: en },
            ru: { translation: ru },
        },
        lng: 'az', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
