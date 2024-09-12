import { useEffect, useState } from 'react';

export const useEllipsis = () => {
  const [ellipsis, setEllipsis] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setEllipsis((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return ellipsis;
};
