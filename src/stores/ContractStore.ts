import { action } from "mobx";
import { AbiItem } from "web3-utils";
import { parseAbiJson } from "../util/abi";
import { toChecksumAddress } from "../util/address";
import { Store } from "./Store";

export interface Contract {
  address: string;
  name: string;
  abi: AbiItem[];
}

export interface ContractData {
  address: string;
  name: string;
  abi: string;
}

export class ContractStore extends Store<Contract, ContractData[]> {
  public static readonly storageKey = "ContractStore";

  protected marshal(): ContractData[] {
    return this.all().map((contract) => ({
      ...contract,
      abi: JSON.stringify(contract.abi),
    }));
  }

  @action
  protected unmarshal(data: ContractData[]): void {
    for (const contract of data) {
      this.add(contract);
    }
  }

  /**
   * Add a contract to the store
   * @param data Contract data
   * @returns Added contract
   */
  @action
  public add(data: ContractData): Contract {
    const contract: Contract = {
      name: data.name.trim(),
      address: toChecksumAddress(data.address),
      abi: parseAbiJson(data.abi),
    };
    this.data.set(data.address.toLowerCase(), contract);
    return contract;
  }
}
