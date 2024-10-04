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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decryptPassword = async () => {
      if (!masterPassword || !serviceId || !serviceType) {
        setError('Missing required data for decryption');
        return;
      }

      const services =
        serviceType === 'guardian'
          ? guardianEncryptedPasswords
          : gatewayEncryptedPasswords;
      const serviceEncryptedPassword = services[serviceId];

      if (!serviceEncryptedPassword) {
        setDecryptedServicePassword(null);
        setError(null);
        return;
      }

      try {
        const decrypted = await decrypt(
          masterPassword,
          serviceEncryptedPassword
        );
        setDecryptedServicePassword(decrypted);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to decrypt password: ${errorMessage}`);
        setDecryptedServicePassword(null);
      }
    };

    decryptPassword();
  }, [
    masterPassword,
    serviceId,
    serviceType,
    guardianEncryptedPasswords,
    gatewayEncryptedPasswords,
  ]);

  return { decryptedServicePassword, error };
};
