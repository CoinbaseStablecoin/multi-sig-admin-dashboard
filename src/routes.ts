export const routes = {
  home: "#/",
  contracts: "#/contracts",
  addContract: "#/contracts/add",
  configurations: "#/configurations",
  proposals: "#/proposals",
  transactions: "#/transactions",
};

export function stripHash(path: string): string {
  return path.replace(/^#/, "");
}
