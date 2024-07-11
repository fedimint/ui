import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  FormHelperText,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FormGroup, NetworkIndicator } from '@fedimint/ui';
import { ReactComponent as BitcoinLogo } from '../../../../assets/svgs/bitcoin.svg';
import { Network, BitcoinRpc } from '@fedimint/types';
import { NumberFormControl } from '../../../NumberFormControl';

interface BitcoinSettingsFormProps {
  network: Network;
  setNetwork: (network: Network) => void;
  bitcoinRpc: BitcoinRpc;
  setBitcoinRpc: (rpc: BitcoinRpc) => void;
  blockConfirmations: string;
  setBlockConfirmations: (value: string) => void;
  isHostOrSolo: boolean;
}

export const BitcoinSettingsForm: React.FC<BitcoinSettingsFormProps> = ({
  network,
  setNetwork,
  bitcoinRpc,
  setBitcoinRpc,
  blockConfirmations,
  setBlockConfirmations,
  isHostOrSolo,
}) => {
  const { t } = useTranslation();

  return (
    <FormGroup
      icon={BitcoinLogo}
      title={
        <>
          <span>{t('set-config.bitcoin-settings') + ': '}</span>
          <NetworkIndicator network={network} bitcoinRpcUrl={bitcoinRpc.url} />
        </>
      }
      isOpen={true}
    >
      {isHostOrSolo && (
        <NumberFormControl
          labelText={t('set-config.block-confirmations')}
          helperText={t('set-config.block-confirmations-help')}
          warningText={t('set-config.block-confirmations-warning')}
          recommendedMin={5}
          min={0}
          max={200}
          value={blockConfirmations}
          onChange={(value) => {
            setBlockConfirmations(value);
          }}
        />
      )}
      <FormControl>
        <FormLabel>{t('set-config.bitcoin-network')}</FormLabel>
        <Select
          placeholder={`${t('set-config.select-network')}`}
          value={network !== null ? network : ''}
          onChange={(ev) => {
            const value = ev.currentTarget.value;
            setNetwork(value as unknown as Network);
          }}
        >
          {Object.entries(Network).map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>{t('set-config.bitcoin-rpc')}</FormLabel>
        <Input
          value={bitcoinRpc.url}
          onChange={(ev) => {
            setBitcoinRpc({ ...bitcoinRpc, url: ev.currentTarget.value });
          }}
        />
        <FormHelperText>{t('set-config.set-rpc-help')}</FormHelperText>
      </FormControl>
    </FormGroup>
  );
};
