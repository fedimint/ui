import React, { useRef } from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import { Main } from './Main';
import { ApiProvider } from './ApiProvider';
import { GatewayApi } from './GatewayApi';

export const App: React.FC = () => {
  const gateway = useRef(() => new GatewayApi());
  return (
    <>
      <ColorModeScript />
      <ApiProvider props={{ gateway: gateway.current() }}>
        <Main />
      </ApiProvider>
    </>
  );
};
