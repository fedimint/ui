import React from 'react';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Icon,
  Flex,
  Box,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { ReactComponent as CheckIcon } from '../../../assets/svgs/check-circle.svg';
import { ReactComponent as CloseIcon } from '../../../assets/svgs/x-circle.svg';
import { AuditSummary, ModuleKind, MSats } from '@fedimint/types';
import { formatValue } from '@fedimint/utils';

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
    return sum + Math.abs(module.net_assets < 0 ? module.net_assets : 0);
  }, 0) as MSats;

  return (
    <Box>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Module</Th>
            <Th isNumeric>Assets</Th>
            <Th isNumeric>Liabilities</Th>
          </Tr>
        </Thead>
        <Tbody>
          {moduleSummaries.map(([key, module]) => (
            <Tr key={key}>
              <Td>{module.kind}</Td>
              <Td isNumeric>
                {module.net_assets > 0
                  ? formatValue(module.net_assets, unit)
                  : '0'}
              </Td>
              <Td isNumeric>
                {module.net_assets < 0
                  ? formatValue(Math.abs(module.net_assets) as MSats, unit)
                  : '0'}
              </Td>
            </Tr>
          ))}
          <Tr>
            <Td fontWeight='bold'>Total</Td>
            <Td isNumeric fontWeight='bold'>
              {formatValue(totalAssets, unit)}
            </Td>
            <Td isNumeric fontWeight='bold'>
              {formatValue(totalLiabilities, unit)}
            </Td>
          </Tr>
        </Tbody>
      </Table>
      {totalAssets - totalLiabilities > 0 && (
        <Box mt={4} p={4} borderWidth={1} borderRadius='md'>
          <Grid templateColumns='1fr 1fr' gap={4} alignItems='center'>
            <GridItem>
              <Text fontWeight='bold'>Accumulated Guardian Fees:</Text>
            </GridItem>
            <GridItem textAlign='right'>
              <Text>(Assets - Liabilities)</Text>
            </GridItem>
            <GridItem colSpan={2} textAlign='center'>
              <Text>
                {`${formatValue(totalAssets, unit)} - ${formatValue(
                  totalLiabilities,
                  unit
                )}`}
              </Text>
            </GridItem>
            <GridItem colSpan={2} textAlign='center'>
              <Text fontWeight='bold'>
                = {formatValue((totalAssets - totalLiabilities) as MSats, unit)}{' '}
                Collected Guardian Fees
              </Text>
            </GridItem>
          </Grid>
        </Box>
      )}
      <Box mt={4} p={4} borderWidth={1} borderRadius='md'>
        <Grid templateColumns='1fr 1fr' gap={4} alignItems='center'>
          <GridItem>
            <Text fontWeight='bold'>Full Reserve?</Text>
          </GridItem>
          <GridItem textAlign='right'>
            <Text>(Assets {'>='} Liabilities)</Text>
          </GridItem>
          <GridItem colSpan={2} textAlign='center'>
            {totalAssets >= totalLiabilities ? (
              <Flex alignItems='center' justifyContent='center'>
                <Text mr={2}>
                  {`${formatValue(totalAssets, unit)} >= ${formatValue(
                    totalLiabilities,
                    unit
                  )}`}
                </Text>
                <Icon as={CheckIcon} color='green.500' />
              </Flex>
            ) : (
              <Flex alignItems='center' justifyContent='center'>
                <Text mr={2}>
                  {`${formatValue(totalLiabilities, unit)} > ${formatValue(
                    totalAssets,
                    unit
                  )}`}
                </Text>
                <Icon as={CloseIcon} color='red.500' />
              </Flex>
            )}
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};
