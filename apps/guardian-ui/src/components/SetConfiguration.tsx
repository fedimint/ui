import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Select,
  Icon,
  Button,
  Text,
  useTheme,
  useClipboard,
} from '@chakra-ui/react';
import {
  BitcoinRpc,
  ConfigGenParams,
  ModuleKind,
  Network,
} from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { FormGroup } from '@fedimint/ui';
import { useSetupContext } from '../hooks';
import { GuardianRole } from '../types';
import { ReactComponent as FedimintLogo } from '../assets/svgs/fedimint.svg';
import { ReactComponent as BitcoinLogo } from '../assets/svgs/bitcoin.svg';
import { ReactComponent as ModulesIcon } from '../assets/svgs/modules.svg';
import { ReactComponent as ArrowRightIcon } from '../assets/svgs/arrow-right.svg';
import { ReactComponent as LightbulbLogo } from '../assets/svgs/lightbulb.svg';
import {
  formatApiErrorMessage,
  getModuleParamsFromConfig,
  applyConfigGenModuleParams,
} from '../utils/api';
import { isValidMeta, isValidNumber } from '../utils/validators';
import { NumberFormControl } from './NumberFormControl';
import { MetaFieldFormControl } from './MetaFieldFormControl';
import { NetworkIndicator } from '@fedimint/ui';
interface Props {
  next: () => void;
}

const MIN_BFT_NUM_PEERS = '4';

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
  const isSolo = role === GuardianRole.Solo;
  const [myName, setMyName] = useState(stateMyName);
  const [password, setPassword] = useState(statePassword);
  const [passwordCheck, setPasswordCheck] = useState(Boolean);
  const [hostServerUrl, setHostServerUrl] = useState('');
  const [defaultParams, setDefaultParams] = useState<ConfigGenParams>();
  const [federationName, setFederationName] = useState('');
  const [metaFields, setMetaFields] = useState<[string, string][]>([['', '']]);
  const [blockConfirmations, setBlockConfirmations] = useState('');
  const [network, setNetwork] = useState('');
  const [bitcoinRpc, setBitcoinRpc] = useState<BitcoinRpc>({
    kind: '',
    url: '',
  });
  const [mintAmounts, setMintAmounts] = useState<number[]>([]);
  const [error, setError] = useState<string>();
  const { onCopy, hasCopied } = useClipboard(password);
  const [numPeers, setNumPeers] = useState(
    stateNumPeers ? stateNumPeers.toString() : isSolo ? '1' : MIN_BFT_NUM_PEERS
  );

  useEffect(() => {
    const initStateFromParams = (params: ConfigGenParams) => {
      setDefaultParams(params);
      setFederationName(params.meta?.federation_name || '');

      const meta = { federation_name: '', ...params.meta };
      setMetaFields(Object.entries(meta));

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
          passwordCheck &&
          federationName &&
          isValidNumber(numPeers, 4) &&
          isValidNumber(blockConfirmations, 1, 200) &&
          isValidMeta(metaFields) &&
          network
      )
    : isSolo
    ? Boolean(
        myName &&
          password &&
          passwordCheck &&
          federationName &&
          isValidNumber(blockConfirmations, 1, 200) &&
          isValidMeta(metaFields) &&
          network
      )
    : Boolean(myName && password && hostServerUrl);

  const handleChangeFederationName = (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newName = ev.currentTarget.value;
    setFederationName(newName);
    setMetaFields((prev) =>
      prev.map(([key, val]) =>
        key === 'federation_name' ? [key, newName] : [key, val]
      )
    );
  };

  const handleNext = async () => {
    setError(undefined);
    try {
      if (!defaultParams)
        throw new Error(
          'Cannot submit before fetching default config gen parameters'
        );
      // Fedimint finality delay is 1 less than the number of block confirmations input by the UI
      const finalityDelay = parseInt(blockConfirmations, 10) - 1;
      const moduleConfigs = applyConfigGenModuleParams(defaultParams.modules, {
        [ModuleKind.Mint]: {
          consensus: { mint_amounts: mintAmounts },
          local: {},
        },
        [ModuleKind.Wallet]: {
          consensus: {
            finality_delay: finalityDelay,
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
      if (isHost || isSolo) {
        // Hosts set their own connection name
        // - They should submit both their local and the consensus config gen params.
        await submitConfiguration({
          myName,
          password,
          configs: {
            numPeers: parseInt(numPeers, 10),
            meta: metaFields.reduce(
              (acc, [key, val]) => ({ ...acc, [key]: val }),
              {}
            ),
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
            modules: moduleConfigs,
          },
        });
      }
      next();
    } catch (err) {
      setError(formatApiErrorMessage(err));
    }
  };

  const generatePassword = () => {
    const getRandomInt = (max: number) => {
      const randomBuffer = new Uint8Array(1);
      window.crypto.getRandomValues(randomBuffer);
      return Math.floor((randomBuffer[0] / 255) * max);
    };

    const passwordLength = 16;
    const charSet = 'abcdefghjkmnpqrstuvwxyz0123456789';

    let adminPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = getRandomInt(charSet.length);
      adminPassword += charSet.charAt(randomIndex);
    }

    setPassword(adminPassword);
  };

  return (
    <Flex direction='column' gap={['2', '6']} justify='start' align='start'>
      <FormGroup
        icon={LightbulbLogo}
        title={`${t('set-config.basic-settings')}`}
        isOpen={true}
      >
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
          <Flex gap={2}>
            <Input
              type='text'
              value={password}
              readOnly
              w='80%'
              placeholder='Password'
            />
            <Button onClick={onCopy} w='20%'>
              {hasCopied ? 'Copied!' : 'Copy'}
            </Button>
          </Flex>
          <FormControl>
            <Button onClick={generatePassword} mt={2} w='100%'>
              Generate Password
            </Button>
          </FormControl>
          <FormHelperText style={{ marginTop: '16px', marginBottom: '16px' }}>
            <Checkbox
              isRequired
              spacing='10px'
              onChange={(e) => setPasswordCheck(e.target.checked)}
            >
              <Text color={theme.colors.yellow[500]}>
                {t('set-config.admin-password-help')}
              </Text>
            </Checkbox>
          </FormHelperText>
        </FormControl>
        {!isHost && !isSolo && (
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
        {(isHost || isSolo) && (
          <FormGroup
            icon={FedimintLogo}
            title={`${t('set-config.federation-settings')}`}
            isOpen={true}
          >
            <FormControl>
              <FormLabel>{t('set-config.federation-name')}</FormLabel>
              <Input
                value={federationName}
                onChange={handleChangeFederationName}
              />
            </FormControl>
            {isHost && (
              <NumberFormControl
                labelText={t('set-config.guardian-number')}
                helperText={t('set-config.guardian-number-help')}
                min={4}
                value={numPeers}
                onChange={(value) => {
                  setNumPeers(value);
                }}
              />
            )}
          </FormGroup>
        )}
        <FormGroup
          icon={BitcoinLogo}
          title={
            <>
              <span>{t('set-config.bitcoin-settings') + ': '}</span>
              <NetworkIndicator
                network={network}
                bitcoinRpcUrl={bitcoinRpc.url}
              />
            </>
          }
          isOpen={true}
        >
          {(isHost || isSolo) && (
            <>
              <NumberFormControl
                labelText={t('set-config.block-confirmations')}
                helperText={t('set-config.block-confirmations-help')}
                warningText={t('set-config.block-confirmations-warning')}
                recommendedMin={6}
                min={1}
                max={200}
                value={blockConfirmations}
                onChange={(value) => {
                  setBlockConfirmations(value);
                }}
              />
            </>
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
        {(isHost || isSolo) && (
          <FormGroup
            icon={ModulesIcon}
            title={t('set-config.meta-fields')}
            isOpen={true}
          >
            <MetaFieldFormControl
              metaFields={metaFields}
              onChangeMetaFields={setMetaFields}
            />
          </FormGroup>
        )}
        {error && (
          <Text color={theme.colors.red[500]} mt={4}>
            {error}
          </Text>
        )}
        <Flex
          direction='row'
          justify='space-between'
          alignSelf='center'
          width={['100%', '100%', '60%']}
        >
          <Button
            isDisabled={!isValid}
            onClick={isValid ? handleNext : undefined}
            leftIcon={<Icon as={ArrowRightIcon} />}
            justifySelf='center'
            alignSelf='center'
            mt={['2', '4']}
            width={['100%', 'auto']}
          >
            {t('common.next')}
          </Button>
        </Flex>
      </>
    </Flex>
  );
};
