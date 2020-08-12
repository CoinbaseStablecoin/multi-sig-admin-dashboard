import { action, observable } from "mobx";
import {
  ConfigureTx,
  isMarshaledConfigureTx,
} from "../transactions/ConfigureTx";
import { MarshaledTx, Transaction } from "../transactions/Transaction";
import { Store } from "./Store";

export class TransactionStore extends Store<MarshaledTx[]> {
  public static readonly storageKey = "TransactionStore";

  @observable
  private transactions = new Map<string, Transaction>();

  protected marshal(): MarshaledTx[] {
    return this.allTransactions().map((tx) => tx.marshal());
  }

  @action
  protected unmarshal(txs: MarshaledTx[]): void {
    for (const txData of txs) {
      let tx: Transaction;
      if (isMarshaledConfigureTx(txData)) {
        tx = ConfigureTx.unmarshal(txData);
      } else {
        console.error(`unsupported tx type: ${txData.type}`);
        continue;
      }
      this.addTransaction(tx);
    }
  }

  /**
   * Add a transaction to the store
   * @param tx Transaction
   */
  @action
  public addTransaction(tx: Transaction): void {
    this.transactions.set(tx.id, tx);
  }

  /**
   * Return all transactions in the store
   * @returns An array of Transaction objects
   */
  public allTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  /**
   * Return the number of transactions in the store
   * @returns Transaction count
   */
  public count(): number {
    return this.transactions.size;
  }
}
