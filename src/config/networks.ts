export interface Network {
  name: string;
  chainId: number;
}

function Network(name: string, chainId: number): Network {
  return { name, chainId };
}

export const networks: { [name: string]: Network } = {
  mainnet: Network("mainnet", 1),
  ropsten: Network("ropsten", 3),
  rinkeby: Network("rinkeby", 4),
  goerli: Network("goerli", 5),
  kovan: Network("kovan", 42),
};
