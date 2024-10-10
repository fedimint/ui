import { useContext } from 'react';
import { AuthContext, AUTH_ACTION_TYPE } from '../context/AuthContext';
import { useMasterPassword } from './useMasterPassword';
import { encrypt } from '../utils/crypto';

export const useAuthContext = () => {
  const { guardianEncryptedPasswords, gatewayEncryptedPasswords, dispatch } =
    useContext(AuthContext);
  const { masterPassword } = useMasterPassword();

  const storeGuardianPassword = async (id: string, password: string | null) => {
    if (!masterPassword) {
      throw new Error('Master password is not available.');
    }
    if (password === null) {
      dispatch({
        type: AUTH_ACTION_TYPE.REMOVE_GUARDIAN_PASSWORD,
        payload: id,
      });
      return;
    }
    const encryptedPassword = await encrypt(masterPassword, password);
    dispatch({
      type: AUTH_ACTION_TYPE.SET_GUARDIAN_PASSWORD,
      payload: { id, encryptedPassword },
    });
  };

  const storeGatewayPassword = async (id: string, password: string | null) => {
    if (!masterPassword) {
      throw new Error('Master password is not available.');
    }
    if (password === null) {
      dispatch({
        type: AUTH_ACTION_TYPE.REMOVE_GATEWAY_PASSWORD,
        payload: id,
      });
      return;
    }
    const encryptedPassword = await encrypt(masterPassword, password);
    console.log('encryptedPassword here', encryptedPassword);
    dispatch({
      type: AUTH_ACTION_TYPE.SET_GATEWAY_PASSWORD,
      payload: { id, encryptedPassword },
    });
  };

  const removeGuardianPassword = (id: string) => {
    dispatch({
      type: AUTH_ACTION_TYPE.REMOVE_GUARDIAN_PASSWORD,
      payload: id,
    });
  };

  const removeGatewayPassword = (id: string) => {
    dispatch({
      type: AUTH_ACTION_TYPE.REMOVE_GATEWAY_PASSWORD,
      payload: id,
    });
  };

  const getEncryptedGuardianPassword = (id: string) =>
    guardianEncryptedPasswords[id] || null;
  const getEncryptedGatewayPassword = (id: string) =>
    gatewayEncryptedPasswords[id] || null;

  return {
    storeGuardianPassword,
    storeGatewayPassword,
    getEncryptedGuardianPassword,
    getEncryptedGatewayPassword,
    removeGuardianPassword,
    removeGatewayPassword,
  };
};
