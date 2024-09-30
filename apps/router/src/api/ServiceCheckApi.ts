import { JsonRpcError, JsonRpcWebsocket } from 'jsonrpc-client-websocket';
import { StatusResponse } from '@fedimint/types';
import { GatewayInfo } from '@fedimint/types';

export class ServiceCheckApi {
  public checkGuardian = async (
    baseUrl: string,
    password: string
  ): Promise<StatusResponse> => {
    if (!baseUrl.startsWith('ws://') && !baseUrl.startsWith('wss://')) {
      throw new Error(
        'Invalid baseUrl for guardian. Must start with ws:// or wss://'
      );
    }
    const requestTimeoutMs = 1000 * 30;
    const websocket = new JsonRpcWebsocket(
      baseUrl,
      requestTimeoutMs,
      (error: JsonRpcError) => {
        console.error('Failed to create websocket', error);
      }
    );
    try {
      await websocket.open();

      const authResponse = await websocket.call('auth', [
        { auth: password, params: null },
      ]);
      if (authResponse.error) {
        throw authResponse.error;
      }

      const statusResponse = await websocket.call('status', [
        { auth: password, params: null },
      ]);
      if (statusResponse.error) {
        throw statusResponse.error;
      }

      await websocket.close();

      return statusResponse.result as StatusResponse;
    } catch (error) {
      console.error('Error checking guardian service:', error);
      throw error;
    }
  };

  public checkGateway = async (
    baseUrl: string,
    password: string
  ): Promise<GatewayInfo> => {
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      throw new Error(
        'Invalid baseUrl for gateway. Must start with http:// or https://'
      );
    }
    try {
      const response = await fetch(`${baseUrl}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
      });

      if (response.ok) {
        const info = await response.json();
        return info as GatewayInfo;
      } else {
        throw new Error(
          `Error fetching gateway info: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Error checking gateway service:', error);
      throw error;
    }
  };
}
