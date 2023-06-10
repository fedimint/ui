import { useContext, useEffect } from 'react';
import { SetupContext, SetupContextValue } from '../SetupContext';
import { AdminContext, AdminContextValue } from '../AdminContext';

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
  }, [shouldPoll]);
}

export function useAdminContext(): AdminContextValue {
  return useContext(AdminContext);
}
