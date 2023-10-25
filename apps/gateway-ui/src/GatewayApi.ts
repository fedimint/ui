import { GatewayInfo, Federation } from './types';

const SESSION_STORAGE_KEY = 'gateway-ui-key';

// GatewayApi is an implementation of the ApiInterface
export class GatewayApi {
  private baseUrl: string | undefined = process.env.REACT_APP_FM_GATEWAY_API;

  // Tests a provided password, or the one in the environment config, or the one in session storage
  testPassword = async (password?: string): Promise<boolean> => {
    const tempPassword =
      password ||
      process.env.REACT_APP_FM_GATEWAY_PASSWORD ||
      this.getPassword();

    if (tempPassword === null) {
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

  private checkConfig = (): void => {
    if (this.baseUrl === undefined || this.getPassword() === undefined) {
      throw new Error(
        'Misconfigured Gateway API. Make sure FM_GATEWAY_API and FM_GATEWAY_PASSWORD are configured appropriately'
      );
    }
  };

  fetchInfo = async (): Promise<GatewayInfo> => {
    try {
      this.checkConfig();
      const res: Response = await fetch(`${this.baseUrl}/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.password}`,
        },
        body: JSON.stringify(null),
      });

      if (res.ok) {
        const info: GatewayInfo = await res.json();
        return Promise.resolve(info);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: 'Error fetching gateway info', error });
    }
  };

  fetchAddress = async (federationId: string): Promise<string> => {
    try {
      this.checkConfig();
      const res: Response = await fetch(`${this.baseUrl}/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.password}`,
        },
        body: JSON.stringify({
          federation_id: federationId,
        }),
      });

      if (res.ok) {
        const address: string = (await res.text()).replace(/"/g, '').trim();
        return Promise.resolve(address);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({
        message: 'Error fetching deposit address',
        error,
      });
    }
  };

  connectFederation = async (inviteCode: string): Promise<Federation> => {
    try {
      this.checkConfig();
      const res: Response = await fetch(`${this.baseUrl}/connect-fed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.password}`,
        },
        body: JSON.stringify({
          invite_code: inviteCode,
        }),
      });

      if (res.ok) {
        const federation: Federation = await res.json();
        return Promise.resolve(federation);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: 'Error connecting federation', error });
    }
  };

  requestWithdrawal = async (
    federationId: string,
    amountSat: number,
    address: string
  ): Promise<string> => {
    try {
      this.checkConfig();
      const res: Response = await fetch(`${this.baseUrl}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.password}`,
        },
        body: JSON.stringify({
          federation_id: federationId,
          amount: amountSat,
          address,
        }),
      });

      if (res.ok) {
        const txid: string = await res.text();
        console.log('txid', txid);
        return Promise.resolve(txid);
      }

      throw responseToError(res);
    } catch (error) {
      return Promise.reject({ message: 'Error requesting withdrawal', error });
    }
  };
}

const responseToError = (res: Response): Error => {
  return new Error(`Status : ${res.status} \nReason : ${res.statusText}\n`);
};
