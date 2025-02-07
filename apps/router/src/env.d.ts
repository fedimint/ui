/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_FM_CONFIG_API?: string;
    readonly VITE_FM_GATEWAY_API?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
