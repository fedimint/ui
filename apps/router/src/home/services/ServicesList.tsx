import React from 'react';
import { ServiceTable } from './ServiceTable';
import { NoConnectedServices } from './NoConnectedServices';
import { GuardianConfig } from '../../types/guardian';
import { GatewayConfig } from '../../types/gateway';

interface ServicesListProps {
  guardians: Record<string, GuardianConfig>;
  gateways: Record<string, GatewayConfig>;
  setEditingService: (service: {
    type: 'guardian' | 'gateway';
    id: string;
  }) => void;
  setRemovingService: (service: {
    type: 'guardian' | 'gateway';
    id: string;
  }) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  guardians,
  gateways,
  setEditingService,
  setRemovingService,
}) => {
  return (
    <>
      {Object.keys(guardians).length > 0 && (
        <ServiceTable
          services={guardians}
          type='guardian'
          setEditingService={setEditingService}
          setRemovingService={setRemovingService}
        />
      )}
      {Object.keys(gateways).length > 0 && (
        <ServiceTable
          services={gateways}
          type='gateway'
          setEditingService={setEditingService}
          setRemovingService={setRemovingService}
        />
      )}
      {Object.keys(guardians).length + Object.keys(gateways).length === 0 && (
        <NoConnectedServices />
      )}
    </>
  );
};
