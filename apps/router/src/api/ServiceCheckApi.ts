import { JsonRpcError, JsonRpcWebsocket } from 'jsonrpc-client-websocket';
import { StatusResponse, GatewayInfo } from '@fedimint/types';

export interface ServiceCheckResponse {
  serviceType: 'guardian' | 'gateway';
  serviceName: string;
  status: string;
  requiresPassword: boolean;
}

export class ServiceCheckApi {
  private static readonly REQUEST_TIMEOUT_MS = 30000;

  public async check(
    baseUrl: string,
    password: string | null
  ): Promise<ServiceCheckResponse> {
    const isWebsocket =
      baseUrl.startsWith('ws://') || baseUrl.startsWith('wss://');
    return isWebsocket
      ? this.checkGuardian(baseUrl, password)
      : this.checkGateway(baseUrl, password);
  }

  private async checkGuardian(
    baseUrl: string,
    password: string | null
  ): Promise<ServiceCheckResponse> {
    const websocket = new JsonRpcWebsocket(
      baseUrl,
      ServiceCheckApi.REQUEST_TIMEOUT_MS,
      (error) => console.error('WebSocket error:', error)
    );

    try {
      await websocket.open();
      const statusResponse = await this.getGuardianStatus(websocket, password);
      const result = statusResponse.result as StatusResponse;

      return {
        serviceType: 'guardian',
        serviceName: 'Guardian',
        status: result.server,
        requiresPassword: result.server === 'awaiting_password',
      };
    } catch (error) {
      if (error instanceof JsonRpcError && error.code === -32600) {
        return {
          serviceType: 'guardian',
          serviceName: 'Guardian',
          status: 'Invalid Password',
          requiresPassword: true,
        };
      }
      throw error;
    } finally {
      await websocket.close();
    }
  }

  private async getGuardianStatus(
    websocket: JsonRpcWebsocket,
    password: string | null
  ) {
    try {
      return await websocket.call('status', [{ auth: password, params: null }]);
    } catch (error) {
      if (error instanceof JsonRpcError && error.code === -32600 && password) {
        // If authentication fails with a password, try without it
        return await websocket.call('status', [{ auth: null, params: null }]);
      }
      throw error;
    }
  }

  private async checkGateway(
    baseUrl: string,
    password: string | null
  ): Promise<ServiceCheckResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (password) {
      headers.Authorization = `Bearer ${password}`;
    }

    const response = await fetch(`${baseUrl}/info`, {
      method: 'GET',
      headers,
    });

    if (response.status === 401) {
      return {
        serviceType: 'gateway',
        serviceName: 'Gateway',
        status: 'Setup',
        requiresPassword: true,
      };
    }

    if (!response.ok) {
      throw new Error(
        `Error fetching gateway info: ${response.status} ${response.statusText}`
      );
    }

    const gatewayInfo = (await response.json()) as GatewayInfo;

    return {
      serviceType: 'gateway',
      serviceName: gatewayInfo.lightning_alias,
      status: gatewayInfo.synced_to_chain ? 'Synced' : 'Syncing',
      requiresPassword: !!password,
    };
  }
}
