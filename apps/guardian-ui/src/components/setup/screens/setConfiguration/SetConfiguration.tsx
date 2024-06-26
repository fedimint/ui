import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Flex,
  Icon,
  Button,
  Text,
  useTheme,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react';
import {
  BitcoinRpc,
  ConfigGenParams,
  ModuleKind,
  Network,
} from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';
import { useSetupContext } from '../../../../hooks';
import { GuardianRole } from '../../../../types';
import { ReactComponent as ArrowRightIcon } from '../../../../assets/svgs/arrow-right.svg';
import {
  formatApiErrorMessage,
  getModuleParamsFromConfig,
  applyConfigGenModuleParams,
} from '../../../../utils/api';
import { isValidMeta, isValidNumber } from '../../../../utils/validators';
import { BasicSettingsForm } from './BasicSettingsForm';
import { FederationSettingsForm } from './FederationSettingsForm';
import { BitcoinSettingsForm } from './BitcoinSettingsForm';
import { ConfirmPasswordModal } from './ConfirmPasswordModal';

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
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const hostCriteria = [
    myName,
    password,
    passwordCheck,
    federationName,
    isValidNumber(numPeers, 4),
    isValidNumber(blockConfirmations, 1, 200),
    isValidMeta(metaFields),
    network,
  ];

  const soloCriteria = [
    myName,
    password,
    passwordCheck,
    federationName,
    isValidNumber(blockConfirmations, 1, 200),
    isValidMeta(metaFields),
    network,
  ];

  const followerCriteria = [myName, password, hostServerUrl];

  const isValid: boolean = isHost
    ? hostCriteria.every(Boolean)
    : isSolo
    ? soloCriteria.every(Boolean)
    : followerCriteria.every(Boolean);

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

  const handleNext = () => {
    if (password !== confirmPassword) {
      onOpen();
    } else {
      submitConfig();
    }
  };

  const submitConfig = async () => {
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

  return (
    <Flex direction='column' gap={['2', '6']} justify='start' align='start'>
      <BasicSettingsForm
        myName={myName}
        setMyName={setMyName}
        password={password}
        setPassword={setPassword}
        hasCopied={hasCopied}
        onCopy={onCopy}
        isFollower={!isHost && !isSolo}
        hostServerUrl={hostServerUrl}
        setHostServerUrl={setHostServerUrl}
      />
      <BitcoinSettingsForm
        network={network as Network}
        setNetwork={setNetwork}
        bitcoinRpc={bitcoinRpc}
        setBitcoinRpc={setBitcoinRpc}
        blockConfirmations={blockConfirmations}
        setBlockConfirmations={setBlockConfirmations}
        isHostOrSolo={isHost || isSolo}
      />
      {(isHost || isSolo) && (
        <FederationSettingsForm
          federationName={federationName}
          handleChangeFederationName={handleChangeFederationName}
          numPeers={numPeers}
          setNumPeers={setNumPeers}
          isHost={isHost}
        />
      )}
      {error && (
        <Text color={theme.colors.red[500]} mt={4}>
          {error}
        </Text>
      )}
      <Flex
        direction='column'
        justify='space-between'
        alignSelf='center'
        width={['100%', '100%', '60%']}
      >
        <Checkbox
          isRequired
          spacing='10px'
          alignSelf='flex-start'
          onChange={(e) => setPasswordCheck(e.target.checked)}
        >
          <Text color={theme.colors.yellow[500]}>
            {t('set-config.admin-password-backup')}
          </Text>
        </Checkbox>
        <Button
          isDisabled={!isValid}
          onClick={isValid ? handleNext : undefined}
          leftIcon={<Icon as={ArrowRightIcon} />}
          mt={['2', '4']}
          width={['25%', 'auto']}
          alignSelf='flex-start'
        >
          {t('common.next')}
        </Button>
      </Flex>
      <ConfirmPasswordModal
        password={password}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        submitConfig={submitConfig}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Flex>
  );
};
