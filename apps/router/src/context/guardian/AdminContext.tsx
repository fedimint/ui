import React, { createContext, ReactNode } from 'react';
// import { AdminApiInterface } from '../guardian-ui/GuardianApi';
import { useGuardianStatus } from '../hooks';
import { GuardianStatus } from '../../guardian-ui/types';

// export interface AdminContextValue {}

export const AdminContext = createContext(null);

export interface AdminContextProviderProps {
  children: ReactNode;
}

export const AdminContextProvider: React.FC<AdminContextProviderProps> = ({
  children,
}: AdminContextProviderProps) => {
  const status = useGuardianStatus();
  if (status !== GuardianStatus.Admin) {
    return null;
  }

  return <AdminContext.Provider value={null}>{children}</AdminContext.Provider>;
};
