import { useLocation } from 'react-router-dom';

export const useActiveService = () => {
  const location = useLocation();
  const [type, id] = location.pathname.split('/').filter(Boolean);

  return {
    type,
    id,
  };
};
