import 'i18next';

import { languages } from './languages';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof languages)[0];
    returnNull: false;
    returnObjects: false;
  }
}
