import React, { createContext, ReactNode } from 'react';
import { AdminApiInterface, GuardianApi } from '../GuardianApi';

export interface AdminContextValue {
  api: AdminApiInterface;
}

export const AdminContext = createContext<AdminContextValue>({
  api: new GuardianApi(),
});

export interface AdminContextProviderProps {
  api: AdminApiInterface;
  children: ReactNode;
}

export const AdminContextProvider: React.FC<AdminContextProviderProps> = ({
  api,
  children,
}: AdminContextProviderProps) => {
  return (
    <AdminContext.Provider
      value={{
        api,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
