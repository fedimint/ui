import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Guardian } from './guardian-ui/Guardian';
import { Gateway } from './gateway-ui/Gateway';
import { Fonts, theme } from '@fedimint/ui';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { ColorModeScript } from '@chakra-ui/react';

import { i18nProvider } from '@fedimint/utils';
import { languages } from './languages';
import { AppContextProvider } from './context/AppContext';
import { HomePage } from './home/HomePage';
import { GuardianContextProvider } from './context/guardian/GuardianContext';
import { GatewayContextProvider } from './context/gateway/GatewayContext';
import { Wrapper } from './components/Wrapper';
import { ChakraProvider } from '@chakra-ui/react';
import { NotificationProvider } from './home/NotificationProvider';

i18nProvider(languages);

const App = () => {
  return (
    <Router>
      <Wrapper>
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
      </Wrapper>
    </Router>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript />
      <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
      <AppContextProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AppContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
