import { useLocation } from 'react-router-dom';

export const useActiveService = (): {
  type: 'guardian' | 'gateway';
  id: string;
} => {
  const location = useLocation();
  const [type, id] = location.pathname.split('/').filter(Boolean);
  if (type !== 'guardian' && type !== 'gateway') {
    throw new Error('Invalid service type');
  }
  return {
    type,
    id,
  };
};
