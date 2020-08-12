export interface MarshaledTx {
  type: string;
  id: string;
  timestamp: number;
}

export abstract class Transaction {
  public static readonly type: string;
  public abstract readonly id: string;
  public abstract readonly timestamp: number;

  /**
   * Convert marshalled data back to an instance of Transaction
   * @param _data
   * @returns Transaction
   */
  public static unmarshal(_data: MarshaledTx): Transaction {
    throw new Error("not implemented");
  }

  /**
   * Convert transaction data to a JSON-stringifiable format
   */
  public abstract marshal(): MarshaledTx;
}
