import { action } from "mobx";
import { Contract, MarshaledContract } from "../models/Contract";
import { Store } from "./Store";

export class ContractStore extends Store<Contract, MarshaledContract[]> {
  public static readonly storageKey = "ContractStore";

  protected marshal(): MarshaledContract[] {
    return this.all().map((contract) => ({
      address: contract.address,
      name: contract.name,
      abi: contract.abi,
    }));
  }

  @action
  protected unmarshal(data: MarshaledContract[]): void {
    for (const marshaled of data) {
      this.add(marshaled);
    }
  }

  /**
   * Add a contract to the store
   * @param marshaled Marshaled contract data
   * @returns Added contract
   */
  @action
  public add(marshaled: MarshaledContract): Contract {
    const { address, name, abi } = marshaled;
    const contract = new Contract(address, name, abi);
    this.data.set(address.toLowerCase(), contract);
    return contract;
  }
}
