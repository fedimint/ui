import { useLocation } from 'react-router-dom';

export * from './guardian/useGuardian';
export * from './guardian/useGuardianSetup';
export * from './gateway/useGateway';
<<<<<<< HEAD
export * from './custom/useTrimmedInput';
=======
export {
  useTrimmedInput,
  useTrimmedInputArray,
} from './custom/useTrimmedInput';
>>>>>>> d42ce8a9 (feat: trim whitespace in verification codes)

import { useContext } from 'react';
import { AppContext, AppContextValue } from '../context/AppContext';

export function useAppContext(): AppContextValue {
  return useContext(AppContext);
}

export const useActiveService = (): {
  type: 'guardian' | 'gateway';
  id: string;
} | null => {
  const location = useLocation();
  const [type, id] = location.pathname.split('/').filter(Boolean);

  if (!type || !id || (type !== 'guardian' && type !== 'gateway')) {
    return null;
  }

  return {
    type,
    id,
  };
};
