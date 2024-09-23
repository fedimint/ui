import { useLocation } from 'react-router-dom';

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
