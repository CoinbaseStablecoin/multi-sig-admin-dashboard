export const routes = {
  home: "#/",
  contracts: "#/contracts",
  configurations: "#/configurations",
  proposals: "#/proposals",
  transactions: "#/transactions",
};

export function stripHash(path: string): string {
  return path.replace(/^#/, "");
}
