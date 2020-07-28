import { Network } from "../config/networks";

export function shortenEthereumAddress(addr: string): string {
  return addr.slice(0, 6) + "⋯" + addr.slice(-4);
}

export function etherscanAddress(addr: string, network: Network): string {
  return `https://${network.name}.etherscan.io/address/${addr}`;
}
