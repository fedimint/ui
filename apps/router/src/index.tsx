import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Guardian } from './guardian-ui/Guardian';
import { Gateway } from './gateway-ui/Gateway';
import { Fonts, SharedChakraProvider, theme } from '@fedimint/ui';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { ColorModeScript } from '@chakra-ui/react';

import { i18nProvider, sha256Hash } from '@fedimint/utils';
import { languages } from './languages';
import { APP_ACTION_TYPE, AppContextProvider } from './context/AppContext';
import { HomePage } from './home/HomePage';
import { GuardianContextProvider } from './context/guardian/GuardianContext';
import { GatewayContextProvider } from './context/gateway/GatewayContext';
import { Wrapper } from './components/Wrapper';
import { ChakraProvider } from '@chakra-ui/react';
import { NotificationProvider } from './home/NotificationProvider';
import { useAppContext } from './hooks';
i18nProvider(languages);

const App = () => {
  const { dispatch } = useAppContext();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    const calculateRedirectPath = async () => {
      if (process.env.REACT_APP_FM_CONFIG_API) {
        try {
          const hash = await sha256Hash(process.env.REACT_APP_FM_CONFIG_API);
          dispatch({
            type: APP_ACTION_TYPE.ADD_GUARDIAN,
            payload: {
              id: hash,
              guardian: {
                config: {
                  id: hash,
                  baseUrl: process.env.REACT_APP_FM_CONFIG_API,
                },
              },
            },
          });
          setRedirectPath(`/guardian/${hash}`);
        } catch (e) {
          console.error(e);
        }
      } else if (process.env.REACT_APP_FM_GATEWAY_API) {
        try {
          const hash = await sha256Hash(process.env.REACT_APP_FM_GATEWAY_API);
          dispatch({
            type: APP_ACTION_TYPE.ADD_GATEWAY,
            payload: {
              id: hash,
              gateway: {
                config: {
                  id: hash,
                  baseUrl: process.env.REACT_APP_FM_GATEWAY_API,
                },
              },
            },
          });
          setRedirectPath(`/gateway/${hash}`);
        } catch (e) {
          console.error(e);
        }
      }
    };

    calculateRedirectPath();
  }, [dispatch]);

  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route
            path='/'
            element={
              redirectPath ? (
                <Navigate to={redirectPath} replace />
              ) : (
                <HomePage />
              )
            }
          />
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
    <ChakraProvider>
      <SharedChakraProvider theme={theme}>
        <ColorModeScript />
        <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
        <AppContextProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AppContextProvider>
      </SharedChakraProvider>
    </ChakraProvider>
  </React.StrictMode>
);
