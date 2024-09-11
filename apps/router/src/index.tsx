import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { App as GuardianApp } from './guardian-ui/App';
import { App as GatewayApp } from './gateway-ui/App';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';
import { Fonts, SharedChakraProvider, theme } from '@fedimint/ui';

import { i18nProvider } from '@fedimint/utils';
import { languages } from './languages';

i18nProvider(languages);

const App = () => (
  <Router>
    <Routes>
      <Route path='/guardian' element={<GuardianApp />} />
      <Route path='/gateway' element={<GatewayApp />} />
      <Route path='/' element={<Navigate to='/guardian' replace />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SharedChakraProvider theme={theme}>
      <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
      <App />
    </SharedChakraProvider>
  </React.StrictMode>
);
