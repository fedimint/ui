import { useContext, useEffect, useState } from 'react';
import { GuardianAppContextValue, GuardianAppContext } from '../AppContext';
import { SetupContext, SetupContextValue } from '../setup/SetupContext';
import { AdminContext, AdminContextValue } from '../admin/AdminContext';

export function useAppContext(): GuardianAppContextValue {
  return useContext(GuardianAppContext);
}

export function useSetupContext(): SetupContextValue {
  return useContext(SetupContext);
}

/**
 * Tells the guardian context to poll for updates. Handles turning off polling
 * on dismount.
 */
export function useConsensusPolling(shouldPoll = true) {
  const { toggleConsensusPolling } = useSetupContext();

  useEffect(() => {
    if (!shouldPoll) return;
    toggleConsensusPolling(true);
    return () => toggleConsensusPolling(false);
  }, [shouldPoll, toggleConsensusPolling]);
}

export function useAdminContext(): AdminContextValue {
  return useContext(AdminContext);
}

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
