import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Guardian } from './guardian-ui/Guardian';
import { Gateway } from './gateway-ui/Gateway';
import { sha256Hash } from '@fedimint/utils';
import { APP_ACTION_TYPE } from './context/AppContext';
import { HomePage } from './home/HomePage';
import { GuardianContextProvider } from './context/guardian/GuardianContext';
import { GatewayContextProvider } from './context/gateway/GatewayContext';
import { Wrapper } from './components/Wrapper';
import { useAppContext } from './hooks';

export default function App() {
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
}
