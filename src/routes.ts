export const routes = {
  home: "/#/",
  contracts: "/#/contracts",
  addContract: "/#/contracts/add",
  editContract: (address: string) => `/#/contracts/${address.toLowerCase()}`,
  configurations: "/#/configurations",
  proposals: "/#/proposals",
  transactions: "/#/transactions",
};

export function stripHash(path: string): string {
  return path.replace(/^\/#/, "");
}
