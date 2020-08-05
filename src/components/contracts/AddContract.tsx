import { H2 } from "@blueprintjs/core";
import React from "react";
import { ContractForm } from "./ContractForm";

export function AddContract(): JSX.Element {
  return (
    <>
      <H2>Add Contract</H2>
      <ContractForm address="" name="" abi="" />
    </>
  );
}
