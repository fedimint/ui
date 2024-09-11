import React from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import { Main } from './Main';
import { AppContextProvider } from './AppContext';
import { Fonts, SharedChakraProvider, theme } from '@fedimint/ui';
import spaceGroteskTtf from '@fedimint/ui/assets/fonts/SpaceGrotesk-Variable.ttf';
import interTtf from '@fedimint/ui/assets/fonts/Inter-Variable.ttf';

export const App: React.FC = () => {
  return (
    <>
      <ColorModeScript />
      <AppContextProvider>
        <Fonts spaceGroteskTtf={spaceGroteskTtf} interTtf={interTtf} />
        <SharedChakraProvider theme={theme}>
          <Main />
        </SharedChakraProvider>
      </AppContextProvider>
    </>
  );
};
