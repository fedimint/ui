import {
  GatewayInfo,
  FederationInfo,
  ChannelInfo,
  GatewayFedConfig,
  CreateBolt11InvoiceV2Payload,
  OpenChannelPayload,
  RoutingInfo,
  PayInvoicePayload,
  SendPaymentV2Payload,
  SetConfigurationPayload,
  PegOutPayload,
  SpendEcashResponse,
  ReceiveEcashResponse,
  GatewayBalances,
} from '@fedimint/types';
import { GatewayConfig } from './types';

export const SESSION_STORAGE_KEY = 'gateway-ui-key';

// GatewayApi is an implementation of the ApiInterface
export class GatewayApi {
  private baseUrl: string;

  constructor(config: GatewayConfig) {
    this.baseUrl = config.baseUrl;
  }

  // Tests a provided password or the one in session storage
  testPassword = async (password?: string): Promise<boolean> => {
    const tempPassword = password || this.getPassword();

    if (!tempPassword) {
      return false;
    }

    // Replace with temp password to check.
    sessionStorage.setItem(SESSION_STORAGE_KEY, tempPassword);

    try {
      await this.fetchInfo();
      return true;
    } catch (err) {
      // TODO: make sure error is auth error, not unrelated
      console.error(err);
      this.clearPassword();
      return false;
    }
  };

  private getPassword = (): string | null => {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  };

  clearPassword = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  private post = async (api: string, body: unknown): Promise<Response> => {
    if (this.baseUrl === undefined) {
      throw new Error(
        'Misconfigured Gateway API. Make sure FM_GATEWAY_API is configured appropriately'
      );
    }

    const password = this.getPassword();
    if (!password) {
      throw new Error(
        'Misconfigured Gateway API. Make sure gateway password is configured appropriately'
      );
    }

    return fetch(`${this.baseUrl}/${api}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(body),
    });
  };

  private get = async (api: string): Promise<Response> => {
    if (this.baseUrl === undefined) {
      throw new Error(
        'Misconfigured Gateway API. Make sure FM_GATEWAY_API is configured appropriately'
      );
    }

    const password = this.getPassword();
    if (!password) {
      throw new Error(
        'Misconfigured Gateway API. Make sure gateway password is configured appropriately'
      );
    }

    return fetch(`${this.baseUrl}/${api}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${password}`,
      },
    });
  };

  /**
   * Fetches a pegin address for a given federation.
   * @param depositAddressPayload - The payload containing the federation ID.
   * @returns The deposit address for the given federation.
   */
  fetchPegInAddress = async (federationId: string): Promise<string> => {
    try {
      const res: Response = await this.post('address', {
        federation_id: federationId,
      });

      if (res.ok) {
        const address: string = await res.json();
        return Promise.resolve(address);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error fetching peg in address', error);
      return Promise.reject({
        message: 'Error fetching peg in address',
        error,
      });
    }
  };

  // TODO: unimplemented in fedimint
  backup = async (federationId: string): Promise<void> => {
    try {
      const res: Response = await this.post('backup', {
        federation_id: federationId,
      });

      if (res.ok) {
        return Promise.resolve();
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error backing up federation', error);
      return Promise.reject({
        message: 'Error backing up federation',
        error,
      });
    }
  };

  fetchBalances = async (): Promise<GatewayBalances> => {
    try {
      const res: Response = await this.get('balances');

      if (res.ok) {
        const balance: GatewayBalances = await res.json();
        return Promise.resolve(balance);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error fetching balance', error);
      return Promise.reject({
        message: 'Error fetching balance',
        error,
      });
    }
  };

  fetchConfigs = async (): Promise<GatewayFedConfig> => {
    try {
      const res: Response = await this.post('config', {});

      if (res.ok) {
        const config: GatewayFedConfig = await res.json();
        return Promise.resolve(config);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error fetching federation config', error);
      return Promise.reject({
        message: 'Error fetching federation config',
        error,
      });
    }
  };

  connectFederation = async (inviteCode: string): Promise<FederationInfo> => {
    try {
      const res: Response = await this.post('connect-fed', {
        invite_code: inviteCode,
      });

      if (res.ok) {
        const federation: FederationInfo = await res.json();
        return Promise.resolve(federation);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error connecting federation', error);
      return Promise.reject({ message: 'Error connecting federation', error });
    }
  };

  createBolt11InvoiceV2 = async (
    payload: CreateBolt11InvoiceV2Payload
  ): Promise<string> => {
    try {
      const res: Response = await this.post('create_bolt11_invoice', payload);

      if (res.ok) {
        const invoice: string = await res.json();
        return Promise.resolve(invoice);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error creating bolt11 invoice v2', error);
      return Promise.reject({
        message: 'Error creating bolt11 invoice v2',
        error,
      });
    }
  };

  fetchInfo = async (): Promise<GatewayInfo> => {
    try {
      const res: Response = await this.get('info');

      if (res.ok) {
        const info: GatewayInfo = await res.json();
        return Promise.resolve(info);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error fetching gateway info', error);
      return Promise.reject({ message: 'Error fetching gateway info', error });
    }
  };

  fetchGatewayId = async (): Promise<string> => {
    try {
      const res: Response = await this.get('id');

      if (res.ok) {
        const gatewayId: string = await res.json();
        return Promise.resolve(gatewayId);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error fetching gateway id', error);
      return Promise.reject({ message: 'Error fetching gateway id', error });
    }
  };

  fetchFundingAddress = async (): Promise<string> => {
    try {
      const res: Response = await this.get('get_funding_address');

      if (res.ok) {
        const address: string = await res.json();
        return Promise.resolve(address);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error fetching funding address', error);
      return Promise.reject({
        message: 'Error fetching funding address',
        error,
      });
    }
  };

  leaveFederation = async (federationId: string): Promise<void> => {
    try {
      const res: Response = await this.post('leave-fed', {
        federation_id: federationId,
      });

      if (!res.ok) {
        throw responseToError(res);
      }
    } catch (error) {
      console.error('Error leaving federation', error);
      return Promise.reject({ message: 'Error leaving federation', error });
    }
  };

  listActiveChannels = async (): Promise<ChannelInfo[]> => {
    try {
      const res: Response = await this.get('list_active_channels');

      if (res.ok) {
        const channels: ChannelInfo[] = await res.json();
        return Promise.resolve(channels);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error listing active channels', error);
      return Promise.reject({
        message: 'Error listing active channels',
        error,
      });
    }
  };

  openChannel = async (payload: OpenChannelPayload): Promise<void> => {
    try {
      const res: Response = await this.post('open_channel', payload);

      if (res.ok) {
        return Promise.resolve();
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error opening channel', error);
      return Promise.reject({ message: 'Error opening channel', error });
    }
  };

  closeChannelsWithPeer = async (pubkey: string): Promise<number> => {
    try {
      const res: Response = await this.post('close_channels_with_peer', {
        pubkey,
      });

      if (res.ok) {
        const numClosed: number = await res.json();
        return Promise.resolve(numClosed);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error closing channels with peer', error);
      return Promise.reject({
        message: 'Error closing channels with peer',
        error,
      });
    }
  };

  routingInfo = async (federationId: string): Promise<RoutingInfo> => {
    try {
      const res: Response = await this.post('routing_info', {
        federation_id: federationId,
      });

      if (res.ok) {
        const routingInfo: RoutingInfo = await res.json();
        return Promise.resolve(routingInfo);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error fetching routing info', error);
      return Promise.reject({ message: 'Error fetching routing info', error });
    }
  };

  payInvoice = async (payload: PayInvoicePayload): Promise<string> => {
    try {
      const res: Response = await this.post('pay_invoice', payload);

      if (res.ok) {
        const preimage: string = await res.json();
        return Promise.resolve(preimage);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error paying invoice', error);
      return Promise.reject({ message: 'Error paying invoice', error });
    }
  };

  // TODO: unimplemented in fedimint
  restore = async (federationId: string): Promise<void> => {
    try {
      const res: Response = await this.post('restore', {
        federation_id: federationId,
      });

      if (res.ok) {
        return Promise.resolve();
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error in restore', error);
      return Promise.reject({ message: 'Error in restore', error });
    }
  };

  sendPaymentV2 = async (payload: SendPaymentV2Payload): Promise<unknown> => {
    try {
      const res: Response = await this.post('send_payment', payload);

      if (res.ok) {
        const result = await res.json();
        console.log('sendPaymentV2 result:', result);
        return Promise.resolve(result);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error sending payment:', error);
      return Promise.reject({ message: 'Failed to send payment', error });
    }
  };

  setConfiguration = async (
    payload: SetConfigurationPayload
  ): Promise<void> => {
    try {
      const res: Response = await this.post('set_configuration', payload);

      if (res.ok) {
        return Promise.resolve();
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error setting configuration', error);
      return Promise.reject({ message: 'Error setting configuration', error });
    }
  };

  submitPegOut = async (payload: PegOutPayload): Promise<string> => {
    try {
      const res: Response = await this.post('withdraw', {
        federation_id: payload.federationId,
        amount: payload.satAmountOrAll,
        address: payload.address,
      });

      if (res.ok) {
        const txid: string = await res.json();
        return Promise.resolve(txid);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error requesting withdrawal', error);
      return Promise.reject({ message: 'Error requesting withdrawal', error });
    }
  };

  spendEcash = async (
    federationId: string,
    amount: number
  ): Promise<string> => {
    try {
      const res: Response = await this.post('spend_ecash', {
        federation_id: federationId,
        amount,
      });

      if (res.ok) {
        const ecash: SpendEcashResponse = await res.json();
        return Promise.resolve(ecash.notes);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error spending ecash', error);
      return Promise.reject({ message: 'Error spending ecash', error });
    }
  };

  receiveEcash = async (notes: string): Promise<number> => {
    const payload = {
      notes: notes,
      wait: true, // Always wait for the ecash to get reissued
    };
    try {
      const res: Response = await this.post('receive_ecash', payload);

      if (res.ok) {
        const resp: ReceiveEcashResponse = await res.json();
        return Promise.resolve(resp.amount);
      }

      throw responseToError(res);
    } catch (error) {
      console.error('Error receiving ecash', error);
      return Promise.reject({ message: 'Error receiving ecash', error });
    }
  };
}

const responseToError = (res: Response): Error => {
  return new Error(`Status : ${res.status} \nReason : ${res.statusText}\n`);
};
