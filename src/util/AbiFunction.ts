import Web3 from "web3";
import { AbiInput, AbiItem } from "web3-utils";

export class AbiFunction {
  public readonly name: string;
  public readonly inputs: AbiInput[];
  public readonly payable: boolean;
  public readonly transactable: boolean;

  private _selector?: string;

  public constructor(abiItem: AbiItem) {
    if (abiItem.type !== "function") {
      throw new Error("The given abiItem is not a function");
    }
    this.name = abiItem.name ?? "";
    this.inputs = abiItem.inputs ?? [];
    const { constant, payable, stateMutability } = abiItem;
    this.payable = payable || stateMutability === "payable";
    this.transactable =
      (!constant && stateMutability !== "view" && stateMutability !== "pure") ||
      payable ||
      stateMutability === "payable" ||
      stateMutability === "nonpayable";
  }

  /**
   * Returns the function signature
   * @params includeArgNames Include argument names
   * @returns A function signature
   */
  public signature(includeArgNames = false): string {
    const args = this.inputs
      .map((input) =>
        includeArgNames ? `${input.type} ${input.name}` : input.type
      )
      .join(includeArgNames ? ", " : ",");
    return `${this.name}(${args})`;
  }

  public get selector(): string {
    if (this._selector) {
      return this._selector;
    }
    this._selector = Web3.utils.keccak256(this.signature(false)).slice(0, 10);
    return this._selector;
  }
}
