import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { Fonts, SharedChakraProvider, theme } from '@fedimint/ui';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <SharedChakraProvider theme={theme}>
      <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
      <App />
    </SharedChakraProvider>
  </React.StrictMode>
);
