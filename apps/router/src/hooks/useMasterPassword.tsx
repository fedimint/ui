import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useMasterPassword = () => {
  const { masterPassword, setMasterPassword, isMasterPasswordSet } =
    useContext(AuthContext);
  return { masterPassword, setMasterPassword, isMasterPasswordSet };
};
