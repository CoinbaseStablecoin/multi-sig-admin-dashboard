import { observable } from "mobx";
import { AbiItem } from "web3-utils";

export interface Contract {
  address: string;
  name: string;
  abi: AbiItem[];
}

export class ContractStore {
  @observable
  public contracts: Contract[] = [];
}
