import { JsonRpcError } from 'jsonrpc-client-websocket';
import { AnyModuleParams, ConfigGenParams } from '../setup/types';
import { ModuleKind } from '../types';

/**
 * Given a config and the name of the module, return the module
 */
export function getModuleParamsFromConfig<T extends AnyModuleParams[0]>(
  config: ConfigGenParams | null,
  moduleName: T
  // Ignore any type below, it will be properly typed at call time via moduleName.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Extract<AnyModuleParams, [T, any]>[1] | null {
  if (!config) return null;
  const module = Object.values(config.modules).find((m) => m[0] === moduleName);
  return module ? module[1] : null;
}

/**
 * Given a config, filter out all non-default modules
 */
export function getOtherModuleParamsFromConfig(
  config: ConfigGenParams | null
): object {
  if (!config) return {};

  return Object.keys(config.modules)
    .filter(
      (key) =>
        config.modules[parseInt(key)][0] != ModuleKind.Mint &&
        config.modules[parseInt(key)][0] !== ModuleKind.Ln &&
        config.modules[parseInt(key)][0] !== ModuleKind.Wallet
    )
    .reduce((cur, key) => {
      return Object.assign(cur, { [key]: config.modules[parseInt(key)] });
    }, {});
}

/**
 * Given an unknown error object, return a user-facing message.
 */
export function formatApiErrorMessage(err: unknown) {
  if (!err) return 'Unknown error';
  if ('error' in (err as { error: JsonRpcError })) {
    return (err as { error: JsonRpcError }).error.message;
  }
  if ('code' in (err as JsonRpcError)) {
    return (err as JsonRpcError).message;
  }
  if ('message' in (err as Error)) {
    return (err as Error).message;
  }
  return (err as object).toString();
}
