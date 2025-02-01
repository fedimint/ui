import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GuardianContextProvider } from './context/guardian/GuardianContext';
import { GatewayContextProvider } from './context/gateway/GatewayContext';
import { useAppContext, useAppInit } from './hooks';
import { Guardian } from './guardian-ui/Guardian';
import { Gateway } from './gateway-ui/Gateway';
import { Wrapper } from './components/Wrapper';
import HomePage from './pages/Home';

export default function App() {
  const { dispatch } = useAppContext();

  const url =
    process.env.REACT_APP_FM_CONFIG_API || process.env.REACT_APP_FM_GATEWAY_API;
  useAppInit(dispatch, url);

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
}
