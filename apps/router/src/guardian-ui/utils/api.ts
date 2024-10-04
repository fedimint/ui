import { JsonRpcError } from 'jsonrpc-client-websocket';
import { AnyModuleParams, ConfigGenParams, ModuleKind } from '@fedimint/types';

/**
 * Given a config and the name of the module, return the module
 */
export function getModuleParamsFromConfig<T extends AnyModuleParams[0]>(
  config: ConfigGenParams | null,
  moduleName: T
): Extract<AnyModuleParams, [T, AnyModuleParams[1]]>[1] | null {
  if (!config) return null;
  const module = Object.values(config.modules).find((m) => m[0] === moduleName);
  return module
    ? (module[1] as Extract<AnyModuleParams, [T, AnyModuleParams[1]]>[1])
    : null;
}

/**
 * Given an existing set of config gen params, and a set of new params, return
 * a deeply-merged new set of config gen params. Handles identifying the module
 * IDs based on the passed in params.
 *
 * Deep merging only occurs at the top level of `consensus` and `local` keys.
 * Any objects or arrays within those will take the new value.
 *
 * Note that this only works on the assumption that there is one of each module.
 * If you have multiple modules, it will apply the parameters only to the first
 * instance of the module.
 */
export function applyConfigGenModuleParams(
  defaultModuleParams: ConfigGenParams['modules'],
  moduleParams: Partial<Record<ModuleKind, AnyModuleParams[1]>>
): ConfigGenParams['modules'] {
  const newModuleParams = { ...defaultModuleParams };
  Object.entries(moduleParams).forEach(([moduleName, params]) => {
    const module = Object.values(newModuleParams).find(
      (m) => m[0] === moduleName
    );
    if (module) {
      module[1] = {
        consensus: { ...module[1].consensus, ...params.consensus },
        local: { ...module[1].local, ...params.local },
      };
    }
  });
  return newModuleParams;
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

/**
 * Converts a hex encoded string to a Blob.
 */
export function hexToBlob(hexData: string, mimeType: string): Blob {
  const byteCharacters = hexData.match(/.{1,2}/g);
  if (!byteCharacters) {
    throw new Error('Invalid hex data');
  }
  const byteArray = new Uint8Array(byteCharacters.map((x) => parseInt(x, 16)));
  return new Blob([byteArray], { type: mimeType });
}
