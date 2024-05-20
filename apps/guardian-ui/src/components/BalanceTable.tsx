import React from 'react';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Icon,
  Box,
  Flex,
} from '@chakra-ui/react';
import { ReactComponent as CheckIcon } from '../assets/svgs/check-circle.svg';
import { ReactComponent as CloseIcon } from '../assets/svgs/x-circle.svg';
import { AuditSummary, ModuleKind, MSats } from '@fedimint/types';
import { formatMsatsToBtc } from '@fedimint/utils';

interface BalanceTableProps {
  auditSummary: AuditSummary;
  unit: 'msats' | 'sats' | 'btc';
}

export const BalanceTable: React.FC<BalanceTableProps> = ({
  auditSummary,
  unit,
}) => {
  const moduleSummaries = Object.entries(auditSummary.module_summaries).filter(
    ([, module]) => module.kind !== ModuleKind.Unknown
  );

  const totalAssets = moduleSummaries.reduce((sum, [, module]) => {
    return sum + (module.net_assets > 0 ? module.net_assets : 0);
  }, 0) as MSats;
  const totalLiabilities = moduleSummaries.reduce((sum, [, module]) => {
    return sum + (module.net_assets < 0 ? module.net_assets : 0);
  }, 0) as MSats;
  const isBalanced = totalAssets + totalLiabilities === 0;

  const formatValue = (value: MSats) => {
    switch (unit) {
      case 'msats':
        return value.toString();
      case 'sats':
        return (value / 1000).toFixed(0);
      case 'btc':
        return formatMsatsToBtc(value);
      default:
        return value.toString();
    }
  };

  return (
    <Box>
      <Flex justifyContent='space-between' alignItems='center' mb={4}></Flex>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Module</Th>
            <Th isNumeric>Assets</Th>
            <Th isNumeric>Liabilities</Th>
            <Th></Th> {/* New column for the checkmark */}
          </Tr>
        </Thead>
        <Tbody>
          {moduleSummaries.map(([key, module]) => (
            <Tr key={key}>
              <Td>{module.kind}</Td>
              <Td isNumeric>
                {module.net_assets > 0 ? formatValue(module.net_assets) : '0'}
              </Td>
              <Td isNumeric>
                {module.net_assets < 0
                  ? formatValue(Math.abs(module.net_assets) as MSats)
                  : '0'}
              </Td>
              <Td></Td> {/* Empty cell for alignment */}
            </Tr>
          ))}
          <Tr fontWeight='bold'>
            <Td>Total</Td>
            <Td isNumeric>{formatValue(totalAssets)}</Td>
            <Td isNumeric>
              {formatValue(Math.abs(totalLiabilities) as MSats)}
            </Td>
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
    </Box>
  );
};
