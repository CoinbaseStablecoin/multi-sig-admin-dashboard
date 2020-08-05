import { action, observable } from "mobx";
import { AbiItem } from "web3-utils";
import { toChecksumAddress } from "../../util/address";
import { Store } from "./Store";

export interface Contract {
  address: string;
  name: string;
  abi: AbiItem[];
}

interface ContractStoreData {
  contracts: Contract[];
}

export class ContractStore extends Store<ContractStoreData> {
  static storageKey = "ContractStore";

  @observable
  public contracts = new Map<string, Contract>();

  protected prepareData(): ContractStoreData {
    return { contracts: Array.from(this.contracts.values()) };
  }

  protected restoreData(data: ContractStoreData): void {
    for (const contract of data.contracts) {
      this.addContract(contract);
    }
  }

  @action
  public addContract(contract: Contract): void {
    const address = toChecksumAddress(contract.address);
    this.contracts.set(address, { ...contract, address });
  }
}
