export const routes = {
  home: "/#/",
  contracts: "/#/contracts",
  addContract: "/#/contracts/add",
  editContract: (address: string) => `/#/contracts/${address.toLowerCase()}`,
  configurations: "/#/configurations",
  newConfiguration: "/#/configurations/new",
  proposals: "/#/proposals",
  transactions: "/#/transactions",
  viewTransaction: (uid: string) => `/#/transactions/${uid}`,
};

export function stripHash(path: string): string {
  return path.replace(/^\/#/, "");
}
