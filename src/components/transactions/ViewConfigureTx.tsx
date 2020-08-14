import { FormGroup, H2, InputGroup, TextArea } from "@blueprintjs/core";
import React from "react";
import { useStores } from "../../hooks/useStores";
import { ConfigureTx } from "../../models/ConfigureTx";

export function ViewConfigureTx({ tx }: { tx: ConfigureTx }): JSX.Element {
  const { contractStore } = useStores();
  const contract = contractStore.get(tx.targetContract);

  const contractName =
    (contract && `${contract.name} (${contract.address})`) || tx.targetContract;

  const selector =
    (contract &&
      contract.transactableFunctions.get(tx.selector)?.signature(true)) ||
    tx.selector;

  return (
    <>
      <H2>Configure Transaction</H2>
      <FormGroup label="Contract" labelFor="target-contract">
        <InputGroup id="target-contract" readOnly value={contractName} />
      </FormGroup>

      <FormGroup label="Function" labelFor="selector">
        <InputGroup id="selector" readOnly value={selector} />
      </FormGroup>

      <FormGroup
        label="Minimum number of approvals required to execute"
        labelFor="min-approvals"
      >
        <InputGroup
          id="min-approvals"
          readOnly
          value={tx.minApprovals.toString()}
        />
      </FormGroup>

      <FormGroup
        label="Maximum number of concurrent open proposals per approver"
        labelFor="max-open-proposals"
      >
        <InputGroup
          id="max-open-proposals"
          readOnly
          value={tx.maxOpenProposals.toString()}
        />
      </FormGroup>

      <FormGroup label="Approvers" labelFor="approvers">
        <TextArea id="approvers" rows={10} fill readOnly value={tx.approvers} />
      </FormGroup>
    </>
  );
}
