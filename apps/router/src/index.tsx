import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Guardian } from './guardian-ui/Guardian';
import { Gateway } from './gateway-ui/Gateway';
import { Fonts, SharedChakraProvider, theme, Wrapper } from '@fedimint/ui';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { ColorModeScript } from '@chakra-ui/react';

import { i18nProvider } from '@fedimint/utils';
import { languages } from './languages';
import { AppContextProvider } from './context/AppContext';
import { HomePage } from './home/HomePage';
import { GuardianContextProvider } from './context/guardian/GuardianContext';
import { GatewayContextProvider } from './context/gateway/GatewayContext';

i18nProvider(languages);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route
          path='/guardian/:id'
          element={
            <GuardianContextProvider>
              <Guardian />
            </GuardianContextProvider>
          }
        />
        <Route
          path='/gateway/:id'
          element={
            <GatewayContextProvider>
              <Gateway />
            </GatewayContextProvider>
          }
        />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SharedChakraProvider theme={theme}>
      <ColorModeScript />
      <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
      <Wrapper>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Wrapper>
    </SharedChakraProvider>
  </React.StrictMode>
);
