import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

type MasterPasswordHook = {
  masterPassword: string | null;
  setMasterPassword: (password: string) => void;
  isMasterPasswordSet: boolean;
};

export const useMasterPassword = (): MasterPasswordHook => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useMasterPassword must be used within an AuthProvider');
  }

  const { masterPassword, setMasterPassword, isMasterPasswordSet } = context;
  return { masterPassword, setMasterPassword, isMasterPasswordSet };
};
