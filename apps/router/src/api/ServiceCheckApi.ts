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

  public async checkWithoutPassword(
    baseUrl: string
  ): Promise<ServiceCheckResponse> {
    const urlType = this.getUrlType(baseUrl);
    return urlType === 'websocket'
      ? this.checkGuardianWithoutPassword(baseUrl)
      : this.checkGatewayWithoutPassword(baseUrl);
  }

  public async checkWithPassword(
    baseUrl: string,
    password: string
  ): Promise<ServiceCheckResponse> {
    const urlType = this.getUrlType(baseUrl);
    return urlType === 'websocket'
      ? this.checkGuardian(baseUrl, password)
      : this.checkGateway(baseUrl, password);
  }

  private getUrlType(url: string): 'websocket' | 'http' {
    if (url.startsWith('ws://') || url.startsWith('wss://')) return 'websocket';
    if (url.startsWith('http://') || url.startsWith('https://')) return 'http';
    throw new Error(
      'Invalid baseUrl. Must start with ws://, wss://, http://, or https://'
    );
  }

  private async checkGuardian(
    baseUrl: string,
    password: string
  ): Promise<ServiceCheckResponse> {
    const websocket = new JsonRpcWebsocket(
      baseUrl,
      ServiceCheckApi.REQUEST_TIMEOUT_MS,
      (error: JsonRpcError) =>
        console.error('Failed to create websocket', error)
    );

    try {
      await websocket.open();
      await this.authenticateWebsocket(websocket, password);
      const statusResponse = await this.getGuardianStatus(websocket, password);
      const result = statusResponse.result as StatusResponse;
      return {
        serviceType: 'guardian',
        serviceName: 'Guardian',
        status: result.server,
        requiresPassword: true,
      };
    } catch (error) {
      console.error('Error checking guardian service:', error);
      throw error;
    } finally {
      await websocket.close();
    }
  }

  private async authenticateWebsocket(
    websocket: JsonRpcWebsocket,
    password: string
  ): Promise<void> {
    const authResponse = await websocket.call('auth', [
      { auth: password, params: null },
    ]);
    if (authResponse.error) throw authResponse.error;
  }

  private async getGuardianStatus(
    websocket: JsonRpcWebsocket,
    password?: string
  ) {
    const statusResponse = await websocket.call('status', [
      { auth: password, params: null },
    ]);
    if (statusResponse.error) throw statusResponse.error;
    return statusResponse;
  }

  private async checkGateway(
    baseUrl: string,
    password: string
  ): Promise<ServiceCheckResponse> {
    try {
      const response = await fetch(`${baseUrl}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
      });

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
        requiresPassword: true,
      };
    } catch (error) {
      console.error('Error checking gateway service:', error);
      throw error;
    }
  }

  private async checkGuardianWithoutPassword(
    baseUrl: string
  ): Promise<ServiceCheckResponse> {
    const websocket = new JsonRpcWebsocket(
      baseUrl,
      ServiceCheckApi.REQUEST_TIMEOUT_MS,
      (error: JsonRpcError) =>
        console.error('Failed to create websocket', error)
    );

    try {
      await websocket.open();
      const statusResponse = await this.getGuardianStatus(websocket);
      const result = statusResponse.result as StatusResponse;
      if (result.server !== 'awaiting_password') {
        return {
          serviceType: 'guardian',
          serviceName: 'Guardian',
          status: 'Setup',
          requiresPassword: true,
        };
      }

      return {
        serviceType: 'guardian',
        serviceName: 'Guardian',
        status: result.server,
        requiresPassword: false,
      };
    } catch (error) {
      if (error instanceof JsonRpcError && error.code === -32600) {
        return {
          serviceType: 'guardian',
          serviceName: 'Guardian',
          status: 'Setup',
          requiresPassword: true,
        };
      }
      throw error;
    } finally {
      await websocket.close();
    }
  }

  private async checkGatewayWithoutPassword(
    baseUrl: string
  ): Promise<ServiceCheckResponse> {
    try {
      const response = await fetch(`${baseUrl}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
        requiresPassword: false,
      };
    } catch (error) {
      console.error('Error checking gateway service:', error);
      throw error;
    }
  }
}
