import React from 'react';
import ReactDOM from 'react-dom/client';
import { SharedChakraProvider, theme, Fonts } from '@fedimint/ui';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { App } from './App';
import { i18nProvider } from '@fedimint/utils';
import { languages } from './languages';

i18nProvider(languages);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
    <SharedChakraProvider theme={theme}>
      <App />
    </SharedChakraProvider>
  </React.StrictMode>
);
