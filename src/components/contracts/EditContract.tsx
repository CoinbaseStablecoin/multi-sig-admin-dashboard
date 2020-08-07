import { H2 } from "@blueprintjs/core";
import React from "react";
import { useParams } from "react-router-dom";
import { useStores } from "../../hooks/useStores";
import { routes } from "../../routes";
import { NotFound } from "../NotFound";
import { ContractForm } from "./ContractForm";

export function EditContract(): JSX.Element {
  const { address } = useParams<{ address: string }>();

  if (address !== address.toLowerCase()) {
    document.location.replace(routes.editContract(address));
  }

  const { contractStore } = useStores();
  const contract = contractStore.getContract(address);

  return contract ? (
    <>
      <H2>Edit Contract</H2>
      <ContractForm
        address={contract.address}
        name={contract.name}
        abi={JSON.stringify(contract.abi)}
      />
    </>
  ) : (
    <NotFound />
  );
}
