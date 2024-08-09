import React from 'react';
import { Flex, Heading, Tabs, TabList, Tab, useTheme } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { Unit, UNIT_OPTIONS } from '../App';

interface HeaderWithUnitSelectorProps {
  setUnit: (unit: Unit) => void;
}

export const HeaderWithUnitSelector: React.FC<HeaderWithUnitSelectorProps> = ({
  setUnit,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Flex
      direction={['column', 'row']}
      justifyContent='space-between'
      alignItems={['flex-start', 'center']}
    >
      <Heading
        as='h1'
        fontSize={['xl', '2xl']}
        fontWeight='500'
        color={theme.colors.gray[900]}
      >
        {t('header.title')}
      </Heading>
      <Tabs
        size='sm'
        variant='soft-rounded'
        defaultIndex={1}
        onChange={(index) => setUnit(UNIT_OPTIONS[index])}
      >
        <TabList>
          {UNIT_OPTIONS.map((option) => (
            <Tab
              key={option}
              _selected={{
                bg: theme.colors.blue[500],
                color: 'white',
              }}
            >
              {option.toUpperCase()}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </Flex>
  );
};
