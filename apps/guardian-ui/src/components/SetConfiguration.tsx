import React, { useEffect, useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Icon,
  Button,
  Text,
  useTheme,
} from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { FormGroup, FormGroupHeading } from '@fedimint/ui';
import { useSetupContext } from '../hooks';
import { BitcoinRpc, ConfigGenParams, GuardianRole, Network } from '../types';
import { ReactComponent as FedimintLogo } from '../assets/svgs/fedimint.svg';
import { ReactComponent as BitcoinLogo } from '../assets/svgs/bitcoin.svg';
import { ReactComponent as ArrowRightIcon } from '../assets/svgs/arrow-right.svg';
import {
  formatApiErrorMessage,
  getModuleParamsFromConfig,
  applyConfigGenModuleParams,
  removeConfigGenModuleConsensusParams,
} from '../utils/api';
import { ModuleKind } from '../types';
import { isValidNumber } from '../utils/validators';
import { NumberFormControl } from './NumberFormControl';

interface Props {
  next: () => void;
}

export const SetConfiguration: React.FC<Props> = ({ next }: Props) => {
  const { t } = useTranslation();
  const {
    state: {
      role,
      configGenParams,
      myName: stateMyName,
      password: statePassword,
      numPeers: stateNumPeers,
    },
    api,
    submitConfiguration,
  } = useSetupContext();
  const theme = useTheme();
  const isHost = role === GuardianRole.Host;
  const [myName, setMyName] = useState(stateMyName);
  const [password, setPassword] = useState(statePassword);
  const [hostServerUrl, setHostServerUrl] = useState('');
  const [defaultParams, setDefaultParams] = useState<ConfigGenParams>();
  const [numPeers, setNumPeers] = useState(
    stateNumPeers ? stateNumPeers.toString() : ''
  );
  const [federationName, setFederationName] = useState('');
  const [blockConfirmations, setBlockConfirmations] = useState('');
  const [network, setNetwork] = useState('');
  const [bitcoinRpc, setBitcoinRpc] = useState<BitcoinRpc>({
    kind: '',
    url: '',
  });
  const [mintAmounts, setMintAmounts] = useState<number[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const initStateFromParams = (params: ConfigGenParams) => {
      setDefaultParams(params);
      setFederationName(params.meta?.federation_name || '');

      const mintModule = getModuleParamsFromConfig(params, ModuleKind.Mint);
      if (mintModule?.consensus?.mint_amounts) {
        setMintAmounts(mintModule?.consensus.mint_amounts);
      }

      const walletModule = getModuleParamsFromConfig(params, ModuleKind.Wallet);
      const walletConsensus = walletModule?.consensus;
      if (walletConsensus?.finality_delay !== undefined) {
        setBlockConfirmations(walletConsensus.finality_delay.toString());
      }
      if (walletConsensus?.network) {
        setNetwork(walletConsensus.network);
      }
      if (walletModule?.local?.bitcoin_rpc) {
        setBitcoinRpc(walletModule.local.bitcoin_rpc);
      }
    };

    if (configGenParams === null) {
      api
        .getDefaultConfigGenParams()
        .then(initStateFromParams)
        .catch((err) => {
          console.error(err);
        });
    } else {
      initStateFromParams(configGenParams);
    }
  }, [configGenParams, api]);

  // Update password when updated from state
  useEffect(() => {
    setPassword(statePassword);
  }, [statePassword]);

  const isValid: boolean = isHost
    ? Boolean(
        myName &&
          password &&
          federationName &&
          isValidNumber(numPeers) &&
          isValidNumber(blockConfirmations) &&
          network
      )
    : Boolean(myName && password && hostServerUrl);

  const handleNext = async () => {
    setError(undefined);
    try {
      if (!defaultParams)
        throw new Error(
          'Cannot submit before fetching default config gen parameters'
        );
      const moduleConfigs = applyConfigGenModuleParams(defaultParams.modules, {
        [ModuleKind.Mint]: {
          consensus: { mint_amounts: mintAmounts },
          local: {},
        },
        [ModuleKind.Wallet]: {
          consensus: {
            finality_delay: parseInt(blockConfirmations, 10),
            network: network as Network,
          },
          local: {
            bitcoin_rpc: bitcoinRpc,
          },
        },
        [ModuleKind.Ln]: {
          consensus: { network: network as Network },
          local: { bitcoin_rpc: bitcoinRpc },
        },
      });
      if (isHost) {
        // Hosts set their own connection name
        // - They should submit both their local and the consensus config gen params.
        await submitConfiguration({
          myName,
          password,
          configs: {
            numPeers: parseInt(numPeers, 10),
            meta: { ...defaultParams.meta, federation_name: federationName },
            modules: moduleConfigs,
          },
        });
      } else {
        // Followers set their own connection name, and hosts server URL to connect to.
        // - They should submit ONLY their local config gen params
        await submitConfiguration({
          myName,
          password,
          configs: {
            hostServerUrl,
            meta: {},
            modules: removeConfigGenModuleConsensusParams(moduleConfigs),
          },
        });
      }
      next();
    } catch (err) {
      setError(formatApiErrorMessage(err));
    }
  };

  return (
    <VStack gap={8} justify='start' align='start'>
      <FormGroup>
        <FormControl>
          <FormLabel>{t('set-config.guardian-name')}</FormLabel>
          <Input
            value={myName}
            onChange={(ev) => setMyName(ev.currentTarget.value)}
          />
          <FormHelperText>{t('set-config.guardian-name-help')}</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>{t('set-config.admin-password')}</FormLabel>
          <Input
            type='password'
            value={password}
            onChange={(ev) => setPassword(ev.currentTarget.value)}
            isDisabled={!!statePassword}
          />
          <FormHelperText>{t('set-config.admin-password-help')}</FormHelperText>
        </FormControl>
        {!isHost && (
          <FormControl>
            <FormLabel>{t('set-config.join-federation')}</FormLabel>
            <Input
              value={hostServerUrl}
              onChange={(ev) => setHostServerUrl(ev.currentTarget.value)}
              placeholder='ws://...'
            />
            <FormHelperText>
              {t('set-config.join-federation-help')}
            </FormHelperText>
          </FormControl>
        )}
      </FormGroup>
      <>
        {isHost && (
          <FormGroup>
            <FormGroupHeading
              icon={FedimintLogo}
              title={`${t('set-config.federation-settings')}`}
            />
            <FormControl>
              <FormLabel>{t('set-config.federation-name')}</FormLabel>
              <Input
                value={federationName}
                onChange={(ev) => setFederationName(ev.currentTarget.value)}
              />
            </FormControl>
            <NumberFormControl
              labelText={t('set-config.guardian-number')}
              errorText={t('set-config.error-valid-number')}
              helperText={t('set-config.guardian-number-help')}
              min={1}
              value={numPeers}
              onChange={(value) => {
                setNumPeers(value);
              }}
            />
          </FormGroup>
        )}
        <FormGroup>
          <FormGroupHeading icon={BitcoinLogo} title='Bitcoin settings' />
          {isHost && (
            <>
              <NumberFormControl
                labelText={t('set-config.block-confirmations')}
                errorText={t('set-config.error-valid-number')}
                helperText={t('set-config.block-confirmations-help')}
                min={1}
                max={200}
                value={blockConfirmations}
                onChange={(value) => {
                  setBlockConfirmations(value);
                }}
              />
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
            </>
          )}
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
      </>
      {error && (
        <Text color={theme.colors.red[500]} mt={4}>
          {error}
        </Text>
      )}
      <div>
        <Button
          isDisabled={!isValid}
          onClick={isValid ? handleNext : undefined}
          leftIcon={<Icon as={ArrowRightIcon} />}
          mt={4}
        >
          {t('common.next')}
        </Button>
      </div>
    </VStack>
  );
};
