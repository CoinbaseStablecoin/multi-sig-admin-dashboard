import { ContractStore } from "./ContractStore";
import { TransactionStore } from "./TransactionStore";

export interface Stores {
  contractStore: ContractStore;
  transactionStore: TransactionStore;
}

export function initializeStores(): Stores {
  return {
    contractStore: new ContractStore(),
    transactionStore: new TransactionStore(),
  };
}

export const defaultStores = initializeStores();
