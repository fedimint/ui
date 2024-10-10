import { useContext } from 'react';
import { AUTH_ACTION_TYPE, AuthContext } from '../context/AuthContext';

export const useAuthContext = () => {
  const { guardianPasswords, gatewayPasswords, dispatch } =
    useContext(AuthContext);

  return {
    getGuardianPassword: (id: string): string | null => guardianPasswords[id],
    getGatewayPassword: (id: string): string | null => gatewayPasswords[id],
    setGuardianPassword: (id: string, password: string) => {
      dispatch({
        type: AUTH_ACTION_TYPE.SET_GUARDIAN_PASSWORD,
        payload: { id, password },
      });
    },
    setGatewayPassword: (id: string, password: string) => {
      dispatch({
        type: AUTH_ACTION_TYPE.SET_GATEWAY_PASSWORD,
        payload: { id, password },
      });
    },
    removeGuardianPassword: (id: string) => {
      dispatch({
        type: AUTH_ACTION_TYPE.REMOVE_GUARDIAN_PASSWORD,
        payload: id,
      });
    },
    removeGatewayPassword: (id: string) => {
      dispatch({
        type: AUTH_ACTION_TYPE.REMOVE_GATEWAY_PASSWORD,
        payload: id,
      });
    },
  };
};
