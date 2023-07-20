import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
export { useTranslation } from 'react-i18next';

type Language = { key: string; description: string; translation: object };

export const i18nProvider = (namespace: Language[]) => {
  const resources = namespace.reduce(
    (acc, { key, translation, description }) => {
      return {
        ...acc,
        [key]: { translation, description },
      };
    },
    {}
  );

  i18n.use(LanguageDetector).use(initReactI18next).init({
    debug: true,
    resources,
    fallbackLng: 'en-US',
  });
};
