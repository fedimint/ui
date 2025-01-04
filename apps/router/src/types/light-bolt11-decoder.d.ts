declare module 'light-bolt11-decoder' {
  interface NetworkValue {
    bech32: string;
    pubKeyHash: number;
    scriptHash: number;
    validWitnessVersions: number[];
  }

  interface RouteHint {
    pubkey: string;
    short_channel_id: string;
    fee_base_msat: number;
    fee_proportional_millionths: number;
    cltv_expiry_delta: number;
  }

  interface FeatureBits {
    option_data_loss_protect: 'unsupported' | 'required';
    initial_routing_sync: 'unsupported' | 'required';
    option_upfront_shutdown_script: 'unsupported' | 'required';
    gossip_queries: 'unsupported' | 'required';
    var_onion_optin: 'unsupported' | 'required';
    gossip_queries_ex: 'unsupported' | 'required';
    option_static_remotekey: 'unsupported' | 'required';
    payment_secret: 'unsupported' | 'required';
    basic_mpp: 'unsupported' | 'required';
    option_support_large_channel: 'unsupported' | 'required';
    extra_bits: {
      start_bit: number;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bits: any[];
      has_required: boolean;
    };
  }

  interface DecodedSection {
    name: string;
    letters: string;
    tag?: string;
    value?: string | number | NetworkValue | RouteHint[] | FeatureBits;
  }

  export interface DecodedInvoice {
    paymentRequest: string;
    sections: DecodedSection[];
    expiry: number;
    route_hints: RouteHint[][];
  }

  export function decode(invoice: string): DecodedInvoice;
}
