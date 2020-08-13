import { getTransactableFunctions, parseAbiJson } from "../util/abi";
import { AbiFunction } from "../util/AbiFunction";
import { toChecksumAddress } from "../util/address";

export interface MarshaledContract {
  address: string;
  name: string;
  abi: string;
}

export class Contract {
  public readonly address: string;
  public readonly name: string;
  public readonly abi: string;
  public readonly transactableFunctions: Map<string, AbiFunction>;

  public constructor(address: string, name: string, abi: string) {
    this.address = toChecksumAddress(address);
    this.name = name.trim();
    this.abi = abi;

    const abiItems = parseAbiJson(this.abi);
    this.transactableFunctions = new Map(
      getTransactableFunctions(abiItems).map((func) => [func.selector, func])
    );
  }
}
