import { CONTRACT_ADDRESS, NETWORK } from "../config";

export interface MarshaledTx {
  type: string;
  id: string;
  timestamp: number;
}

export interface TxParams {
  to: string;
  value: string;
  data: string;
  chainId: number;
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
   * @returns Marshaled transaction data
   */
  public abstract marshal(): MarshaledTx;

  /**
   * Return transaction parameters
   * @returns Transaction parameters
   */
  public params(): TxParams {
    return {
      to: CONTRACT_ADDRESS.toLowerCase(),
      value: "0x0",
      data: "0x",
      chainId: NETWORK.chainId,
    };
  }
}
