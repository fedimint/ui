import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { decrypt } from '../utils/crypto';
import { useMasterPassword } from './useMasterPassword';

export const useUnlockedService = (
  serviceId: string,
  serviceType: 'guardian' | 'gateway'
) => {
  const { guardianEncryptedPasswords, gatewayEncryptedPasswords } =
    useContext(AuthContext);
  const { masterPassword } = useMasterPassword();
  const [decryptedServicePassword, setDecryptedServicePassword] = useState<
    string | null
  >(null);

  useEffect(() => {
    const decryptPassword = async () => {
      if (!masterPassword || !serviceId || !serviceType) return;
      const services =
        serviceType === 'guardian'
          ? guardianEncryptedPasswords
          : gatewayEncryptedPasswords;
      const serviceEncryptedPassword = services[serviceId];
      if (!serviceEncryptedPassword) return;
      const decrypted = await decrypt(serviceEncryptedPassword, masterPassword);
      setDecryptedServicePassword(decrypted);
    };

    decryptPassword();
  }, [
    masterPassword,
    serviceId,
    serviceType,
    guardianEncryptedPasswords,
    gatewayEncryptedPasswords,
  ]);

  return {
    decryptedServicePassword,
  };
};
