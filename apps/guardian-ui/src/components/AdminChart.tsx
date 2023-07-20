import React, { FC } from 'react';
import { Box, Flex, Stack, Text, theme } from '@chakra-ui/react';

interface TabProps {
  text: string;
  active: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

const Tab: FC<TabProps> = ({ text, active, onClick, style }) => {
  return (
    <Box
      p='9px 17px'
      cursor='pointer'
      onClick={onClick}
      bgColor={active ? theme.colors.gray[200] : 'transparent'}
      style={style}
      _hover={{ bgColor: theme.colors.gray[200] }}
    >
      <Text fontWeight='semibold' color={theme.colors.gray[700]} fontSize='sm'>
        {text}
      </Text>
    </Box>
  );
};

const PeriodicChartTab = () => {
  return (
    <Flex border={`1px solid ${theme.colors.gray[300]}`} borderRadius='6px'>
      <Tab
        text='Daily'
        active={true}
        onClick={function (): void {
          return;
        }}
        style={{
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
        }}
      />
      <Tab
        text='Monthly'
        active={false}
        onClick={function (): void {
          return;
        }}
        style={{
          borderLeft: `1px solid ${theme.colors.gray[300]}`,
          borderRight: `1px solid ${theme.colors.gray[300]},`,
        }}
      />
      <Tab
        text='All time'
        active={false}
        onClick={function (): void {
          return;
        }}
        style={{
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        }}
      />
    </Flex>
  );
};

const CurrencyChartTab = () => {
  return (
    <Flex border={`1px solid ${theme.colors.gray[300]}`} borderRadius='6px'>
      <Tab
        text='Bitcoin'
        active={true}
        onClick={function (): void {
          return;
        }}
        style={{
          borderTopLeftRadius: '6px',
          borderBottomLeftRadius: '6px',
        }}
      />
      <Tab
        text='eCash'
        active={false}
        onClick={function (): void {
          return;
        }}
        style={{
          borderLeft: `1px solid ${theme.colors.gray[300]}`,
          borderRight: `1px solid ${theme.colors.gray[300]}`,
        }}
      />
      <Tab
        text='US Dollar'
        active={false}
        onClick={function (): void {
          return;
        }}
        style={{
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        }}
      />
    </Flex>
  );
};

export const AdminChart = () => {
  return (
    <Stack mt='16px'>
      <Flex gap={4}>
        <PeriodicChartTab />
        <CurrencyChartTab />
      </Flex>
    </Stack>
  );
};
