import {
  ContractAddresses as NounsContractAddresses,
  getContractAddressesForChainOrThrow,
} from '@nouns/sdk';
import { ChainId } from '@usedapp/core';

interface ExternalContractAddresses {
  lidoToken: string | undefined;
}

export type ContractAddresses = NounsContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  nounsDAOSubgraphApiUri: string;
  enableHistory: boolean;
  nounsApiUri: string;
  enableRollbar: boolean;
  zoraKey: string;
}

type SupportedChains = ChainId.Rinkeby | ChainId.Mainnet | ChainId.Hardhat;
interface CacheBucket {
  name: string;
  version: string;
}

export const cache: Record<string, CacheBucket> = {
  seedExpriy: {
    name: 'seedExpriy',
    version: 'v1',
  },
  bigNounSeed: {
    name: 'bigNounSeed',
    version: 'v1',
  },
  seed: {
    name: 'seed',
    version: 'v1',
  },
  ens: {
    name: 'ens',
    version: 'v1',
  },
};

export const cacheKey = (bucket: CacheBucket, ...parts: (string | number)[]) => {
  return [bucket.name, bucket.version, ...parts].join('-').toLowerCase();
};

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '1');

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);

//TODO: replaced infura for prod
export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];

  if (network === 'rinkeby') {
    return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
  } else {
    return custom || isLocalhost
      ? `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`
      : `https://eth-mainnet.alchemyapi.io/v2/tEAmLPls4-IajaZM2nyTIfG6CqK_uAb0`;
  }
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];

  if (network === 'rinkeby') {
    return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
  } else {
    return custom || isLocalhost
      ? `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`
      : 'wss://eth-mainnet.alchemyapi.io/v2/tEAmLPls4-IajaZM2nyTIfG6CqK_uAb0';
  }
};

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Rinkeby]: {
    jsonRpcUri: createNetworkHttpUrl('rinkeby'),
    wsRpcUri: createNetworkWsUrl('rinkeby'),
    subgraphApiUri:
      'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph-rinkeby',
    nounsDAOSubgraphApiUri:
      'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph-rinkeby',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    nounsApiUri: process.env[`REACT_APP_RINKEBY_NOUNSAPI`] || '',
    enableRollbar: process.env.REACT_APP_ENABLE_ROLLBAR === 'true',
    zoraKey: process.env.ZORA_API_KEY || '',
  },
  [ChainId.Mainnet]: {
    jsonRpcUri: createNetworkHttpUrl('mainnet'),
    wsRpcUri: createNetworkWsUrl('mainnet'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/lilnounsdao/lil-nouns-subgraph',
    nounsDAOSubgraphApiUri: 'https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
    nounsApiUri: process.env[`REACT_APP_MAINNET_NOUNSAPI`] || '',
    enableRollbar: process.env.REACT_APP_ENABLE_ROLLBAR === 'true',
    zoraKey: process.env.ZORA_API_KEY || '',
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: '',
    nounsDAOSubgraphApiUri: '',
    enableHistory: false,
    nounsApiUri: 'http://localhost:5001',
    enableRollbar: false,
    zoraKey: '',
  },
};

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [ChainId.Rinkeby]: {
    lidoToken: '0xF4242f9d78DB7218Ad72Ee3aE14469DBDE8731eD',
  },
  [ChainId.Mainnet]: {
    lidoToken: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  },
  [ChainId.Hardhat]: {
    lidoToken: undefined,
  },
};

const getAddresses = (): ContractAddresses => {
  let nounsAddresses = {} as NounsContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {}
  return { ...nounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const config = {
  app: app[CHAIN_ID],
  isPreLaunch: process.env.REACT_APP_IS_PRELAUNCH || 'false',
  addresses: getAddresses(),
  isPropLotBetaEnabled: process.env.REACT_APP_PROP_LOT_BETA_ENABLED === 'true',
};

export default config;
