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
        console.error('Missing required data for decryption');
        setError('Missing required data for decryption');
        return;
      }

      const services =
        serviceType === 'guardian'
          ? guardianEncryptedPasswords
          : gatewayEncryptedPasswords;

      const serviceEncryptedPassword = services[serviceId];
      if (!serviceEncryptedPassword) {
        console.error(`No encrypted password found for service ${serviceId}`);
        setError(`No encrypted password found for service ${serviceId}`);
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
        if (err instanceof Error) {
          console.error('Decryption error:', err);
          setError(`Failed to decrypt password: ${err.message}`);
        } else {
          console.error('Unknown decryption error:', err);
          setError('Failed to decrypt password: Unknown error');
        }
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

  return {
    decryptedServicePassword,
    error,
  };
};
