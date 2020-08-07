import Web3 from "web3";

/**
 * Shortens an Ethereum address. It does not validate the address given.
 * @param address Ethereum address to shorten
 * @returns Shortened address
 */
export function shortenAddress(address: string): string {
  return address.slice(0, 6) + "⋯" + address.slice(-4);
}

/**
 * Get Etherscan address for the address given
 * @param address Ethereum address
 * @param network Network ("mainnet", "ropsten", etc.)
 * @returns Etherscan address
 */
export function etherscanAddress(address: string, network: string): string {
  return `https://${network}.etherscan.io/address/${address}`;
}

/**
 * Checks whether a given Ethereum address is valid
 * @param address Ethereum address
 * @returns True if valid
 */
export function isValidAddress(address: string): boolean {
  return Web3.utils.isAddress(address);
}

/**
 * Convert an address to a checksum address
 * @throws {Error} Invalid address
 * @param address Ethereum address
 * @returns Checksum address
 */
export function toChecksumAddress(address: string): string {
  return Web3.utils.toChecksumAddress(address);
}
