import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { SharedChakraProvider, theme } from '@fedimint/ui';
import { i18nProvider } from '@fedimint/utils';
import { languages } from '../../languages';
import { AppContext, initialState } from '../../context/AppContext';

i18nProvider(languages);

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SharedChakraProvider theme={theme}>
      <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
    </SharedChakraProvider>
  );
};

const customRender = (ui: ReactElement) => render(ui, { wrapper: TestWrapper });

export * from '@testing-library/react';
export { customRender as render };
