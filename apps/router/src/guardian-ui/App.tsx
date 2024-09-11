import React from 'react';
import { Main } from './Main';
import { GuardianAppContextProvider } from './AppContext';

export const App: React.FC = () => {
  return (
    <GuardianAppContextProvider>
      <Main />
    </GuardianAppContextProvider>
  );
};
