import { useContext } from 'react';
import { AuthContext, AUTH_ACTION_TYPE } from '../context/AuthContext';

export const useAuth = () => {
  const { guardianPasswords, gatewayPasswords, dispatch } =
    useContext(AuthContext);

  const setGuardianPassword = (id: string, password: string) => {
    dispatch({
      type: AUTH_ACTION_TYPE.SET_GUARDIAN_PASSWORD,
      payload: { id, password },
    });
  };

  const setGatewayPassword = (id: string, password: string) => {
    dispatch({
      type: AUTH_ACTION_TYPE.SET_GATEWAY_PASSWORD,
      payload: { id, password },
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

  const getGuardianPassword = (id: string) => guardianPasswords[id] || null;
  const getGatewayPassword = (id: string) => gatewayPasswords[id] || null;

  return {
    setGuardianPassword,
    setGatewayPassword,
    getGuardianPassword,
    getGatewayPassword,
    removeGuardianPassword,
    removeGatewayPassword,
  };
};
