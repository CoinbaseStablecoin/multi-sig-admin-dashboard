import { ContractStore } from "./ContractStore";

export interface Stores {
  contractStore: ContractStore;
}

export function initializeStores(): Stores {
  return {
    contractStore: new ContractStore(),
  };
}

export const defaultStores = initializeStores();
