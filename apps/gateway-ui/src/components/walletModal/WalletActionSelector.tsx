import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { WalletModalAction, WalletModalType } from './WalletModal';
import { WalletTypeButtons } from './WalletTypeButtons';

interface WalletActionSelectorProps {
  action: WalletModalAction;
  type: WalletModalType;
  onActionChange: (action: WalletModalAction) => void;
  onTypeChange: (type: WalletModalType) => void;
}

export const WalletActionSelector: React.FC<WalletActionSelectorProps> = ({
  action,
  type,
  onActionChange,
  onTypeChange,
}) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Tabs
        index={action === WalletModalAction.Receive ? 0 : 1}
        onChange={(index) =>
          onActionChange(
            index === 0 ? WalletModalAction.Receive : WalletModalAction.Send
          )
        }
        isFitted
        variant='enclosed-colored'
      >
        <TabList color='gray.500'>
          <Tab fontWeight='bold' fontSize='lg'>
            {t('wallet.receive')}
          </Tab>
          <Tab fontWeight='bold' fontSize='lg'>
            {t('wallet.send')}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <WalletTypeButtons type={type} onTypeChange={onTypeChange} />
          </TabPanel>
          <TabPanel>
            <WalletTypeButtons type={type} onTypeChange={onTypeChange} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
