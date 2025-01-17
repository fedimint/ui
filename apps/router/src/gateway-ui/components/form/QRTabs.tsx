import React from 'react';
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { QRCodePanel } from './QRPanel';

type QRCodeTabsProps = {
  addressValue: string;
  addressLabel: string;
  onCopyAddress: () => void;
  uriValue?: string;
  uriLabel?: string;
  onCopyUri?: () => void;
};
export const QRCodeTabs: React.FC<QRCodeTabsProps> = ({
  uriValue,
  addressValue,
  onCopyUri,
  onCopyAddress,
  uriLabel,
  addressLabel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex
        direction='column'
        alignItems='center'
        gap={4}
        maxWidth='300px'
        mx='auto'
      >
        <Tabs width='100%' isFitted>
          <TabList>
            <Tab>{addressLabel}</Tab>
            {uriValue && <Tab>{uriLabel}</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <QRCodePanel value={addressValue} onCopy={onCopyAddress} />
            </TabPanel>
            {uriValue && uriLabel && onCopyUri && (
              <TabPanel>
                <QRCodePanel value={uriValue} onCopy={onCopyUri} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>
    </motion.div>
  );
};
