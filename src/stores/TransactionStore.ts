import { action } from "mobx";
import { ConfigureTx, isMarshaledConfigureTx } from "../models/ConfigureTx";
import { MarshaledTx, Transaction } from "../models/Transaction";
import { Store } from "./Store";

export class TransactionStore extends Store<Transaction, MarshaledTx[]> {
  public static readonly storageKey = "TransactionStore";

  protected marshal(): MarshaledTx[] {
    return this.all().map((tx) => tx.marshal());
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
      this.add(tx);
    }
  }

  /**
   * Add a transaction to the store
   * @param tx Transaction
   */
  @action
  public add(tx: Transaction): void {
    this.data.set(tx.id, tx);
  }
}
