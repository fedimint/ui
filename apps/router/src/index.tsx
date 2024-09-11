import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { App as GuardianApp } from './guardian-ui/App';
import { App as GatewayApp } from './gateway-ui/App';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { Fonts, SharedChakraProvider, theme } from '@fedimint/ui';

import { i18nProvider } from '@fedimint/utils';
import { languages } from './languages';
import { AppContextProvider } from './AppContext';
import { ColorModeScript } from '@chakra-ui/react';
import { HomePage } from './home/HomePage';

i18nProvider(languages);

const App = () => (
  <Router>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/guardian/:id' element={<GuardianApp />} />
      <Route path='/gateway/:id' element={<GatewayApp />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SharedChakraProvider theme={theme}>
      <AppContextProvider>
        <ColorModeScript />
        <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
        <App />
      </AppContextProvider>
    </SharedChakraProvider>
  </React.StrictMode>
);
