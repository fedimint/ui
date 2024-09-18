import { useLocation } from 'react-router-dom';

export const useActiveService = () => {
  const location = useLocation();
  const [type, id] = location.pathname.split('/').filter(Boolean);

  return {
    activeServiceId: type && id ? `${type}/${id}` : null,
    serviceType: type as 'guardian' | 'gateway' | null,
    serviceId: id || null,
  };
};
