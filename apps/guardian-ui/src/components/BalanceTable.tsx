import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr, Icon } from '@chakra-ui/react';
import { ReactComponent as CheckIcon } from '../assets/svgs/check-circle.svg';
import { ReactComponent as CloseIcon } from '../assets/svgs/x-circle.svg';
import { AuditSummary, MSats } from '@fedimint/types';
import { formatMsatsToBtc } from '@fedimint/utils';

interface BalanceTableProps {
  auditSummary: AuditSummary;
}

const BalanceTable: React.FC<BalanceTableProps> = ({ auditSummary }) => {
  const moduleSummaries = Object.entries(auditSummary.module_summaries);

  const totalAssets = moduleSummaries.reduce((sum, [, module]) => {
    return sum + (module.net_assets > 0 ? module.net_assets : 0);
  }, 0) as MSats;

  const totalLiabilities = moduleSummaries.reduce((sum, [, module]) => {
    return sum + (module.net_assets < 0 ? module.net_assets : 0);
  }, 0) as MSats;
  const isBalanced = totalAssets + totalLiabilities === 0;

  return (
    <Table variant='simple'>
      <Thead>
        <Tr>
          <Th>Module</Th>
          <Th>Assets</Th>
          <Th>Liabilities</Th>
        </Tr>
      </Thead>
      <Tbody>
        {moduleSummaries.map(([key, module]) => (
          <Tr key={key}>
            <Td>{module.kind}</Td>
            <Td>
              {module.net_assets > 0 ? formatMsatsToBtc(module.net_assets) : ''}
            </Td>
            <Td>
              {module.net_assets < 0
                ? formatMsatsToBtc(Math.abs(module.net_assets) as MSats)
                : ''}
            </Td>
          </Tr>
        ))}
        <Tr fontWeight='bold'>
          <Td>Total</Td>
          <Td>{formatMsatsToBtc(totalAssets)}</Td>
          <Td>{formatMsatsToBtc(Math.abs(totalLiabilities) as MSats)}</Td>
          <Td>
            {isBalanced ? (
              <Icon as={CheckIcon} color='green.500' />
            ) : (
              <Icon as={CloseIcon} color='red.500' />
            )}
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default BalanceTable;
