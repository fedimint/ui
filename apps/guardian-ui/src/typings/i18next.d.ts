import 'i18next';

// import translation from './languages/en.json';
import { languages } from './languages';

declare module 'i18next' {
  interface CustomTypeOptions {
    // resources: { translation: typeof translation };
    resources: (typeof languages)[0];
    returnNull: false;
    returnObjects: false;
  }
}
