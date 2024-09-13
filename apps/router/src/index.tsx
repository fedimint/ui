import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Guardian } from './guardian-ui/Guardian';
import { Gateway } from './gateway-ui/Gateway';
import { SharedChakraProvider, theme } from '@fedimint/ui';

import { i18nProvider } from '@fedimint/utils';
import { languages } from './languages';
import { AppContextProvider } from './context/AppContext';
import { HomePage } from './home/HomePage';
import { useAppContext } from './context/hooks';
import { GuardianContextProvider } from './context/guardian/GuardianContext';
import { GatewayContextProvider } from './context/gateway/GatewayContext';

i18nProvider(languages);

const App = () => {
  const { selectedService } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {selectedService?.kind === 'guardian' && (
          <Route
            path='/guardian/:id'
            element={
              <GuardianContextProvider>
                <Guardian />
              </GuardianContextProvider>
            }
          />
        )}
        {selectedService?.kind === 'gateway' && (
          <Route
            path='/gateway/:id'
            element={
              <GatewayContextProvider>
                <Gateway />
              </GatewayContextProvider>
            }
          />
        )}
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
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </SharedChakraProvider>
  </React.StrictMode>
);
