import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { Fonts, SharedChakraProvider, theme } from '@fedimint/ui';

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
