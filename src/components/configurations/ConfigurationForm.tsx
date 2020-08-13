import {
  AnchorButton,
  Button,
  Classes,
  FormGroup,
  HTMLSelect,
  InputGroup,
  Intent,
  TextArea,
} from "@blueprintjs/core";
import React, { useCallback, useMemo, useState } from "react";
import { useStores } from "../../hooks/useStores";
import { routes } from "../../routes";
import { toaster } from "../../toaster";
import { ConfigureTx } from "../../transactions/ConfigureTx";
import { getTransactableFunctions } from "../../util/abi";
import { isValidAddress } from "../../util/address";
import { handleIntegerChange, handleStringChange } from "../common/handlers";
import { commonStyles } from "../common/styles";

export function ConfigurationForm(): JSX.Element {
  const { contractStore, transactionStore } = useStores();

  const [targetContract, setTargetContract] = useState("");
  const [selector, setSelector] = useState("");
  const [minApprovals, setMinApprovals] = useState(1);
  const [maxOpenProposals, setMaxOpenProposals] = useState(10);
  const [approvers, setApprovers] = useState("");

  const approverAddresses = useMemo(() => parseApprovers(approvers), [
    approvers,
  ]);

  const handleTargetContractChange = useCallback(
    handleStringChange((v: string) => {
      setTargetContract(v);
      setSelector("");
    }),
    []
  );
  const handleSelectorChange = useCallback(handleStringChange(setSelector), []);
  const handleMinApprovalsChange = useCallback(
    handleIntegerChange(setMinApprovals),
    []
  );
  const handleMaxOpenProposalsChange = useCallback(
    handleIntegerChange(setMaxOpenProposals),
    []
  );
  const handleApproversChange = useCallback(
    handleStringChange(setApprovers),
    []
  );

  const handleSubmit = useCallback(
    (evt: React.FormEvent) => {
      evt.preventDefault();
      const tx = new ConfigureTx(
        targetContract,
        selector,
        minApprovals,
        maxOpenProposals,
        approverAddresses || []
      );
      transactionStore.add(tx);
      transactionStore.save();
      toaster.show({
        message: "Configure transaction created",
        intent: "success",
      });
      document.location.assign(routes.transactions);
    },
    [
      targetContract,
      selector,
      minApprovals,
      maxOpenProposals,
      approverAddresses,
      transactionStore,
    ]
  );

  const contracts = contractStore.all();

  const functions = useMemo(() => {
    const contract = contractStore.get(targetContract);
    if (!contract) {
      return [];
    }
    return getTransactableFunctions(contract.abi);
  }, [contractStore, targetContract]);

  const validApprovers = approverAddresses !== null;
  const approversIntent = validApprovers ? Intent.NONE : Intent.DANGER;

  const maxApprovals = approverAddresses?.length || 1;
  const validMinApprovals =
    minApprovals > 0 &&
    minApprovals <= 100 &&
    (approverAddresses === null || minApprovals <= maxApprovals);
  const minApprovalsIntent = validMinApprovals ? Intent.NONE : Intent.DANGER;

  const validMaxOpenProposals = maxOpenProposals > 0 && maxOpenProposals <= 100;
  const maxOpenProposalsIntent = validMaxOpenProposals
    ? Intent.NONE
    : Intent.DANGER;

  const createTxDisabled =
    !validApprovers ||
    !validMinApprovals ||
    !validMaxOpenProposals ||
    approverAddresses === null ||
    approverAddresses.length === 0;

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup label="Contract" labelFor="target-contract">
        <HTMLSelect
          id="target-contract"
          data-testid="target-contract"
          fill
          required
          value={targetContract}
          onChange={handleTargetContractChange}
        >
          <option value="">Select a contract...</option>
          {contracts.map((contract, i) => (
            <option key={i} value={contract.address}>
              {contract.name} ({contract.address})
            </option>
          ))}
        </HTMLSelect>
      </FormGroup>

      <FormGroup label="Function" labelFor="selector">
        <HTMLSelect
          id="selector"
          data-testid="selector"
          fill
          required
          value={selector}
          onChange={handleSelectorChange}
        >
          <option value="">Select a function...</option>
          {functions.map((func, i) => (
            <option key={i} value={func.selector}>
              {func.signature(true)}
            </option>
          ))}
        </HTMLSelect>
      </FormGroup>

      <FormGroup
        label="Minimum number of approvals required to execute"
        helperText="Must be greater than 0 and less than or equal to the number of approvers"
        intent={minApprovalsIntent}
        labelFor="min-approvals"
      >
        <InputGroup
          id="min-approvals"
          data-testid="min-approvals"
          placeholder="1"
          type="number"
          min={1}
          max={100}
          required
          value={minApprovals.toString()}
          intent={minApprovalsIntent}
          onChange={handleMinApprovalsChange}
        />
      </FormGroup>

      <FormGroup
        label="Maximum number of concurrent open proposals per approver"
        helperText="Must be greater than 0"
        intent={maxOpenProposalsIntent}
        labelFor="max-open-proposals"
      >
        <InputGroup
          id="max-open-proposals"
          data-testid="max-open-proposals"
          placeholder="10"
          type="number"
          min={1}
          max={100}
          required
          value={maxOpenProposals.toString()}
          intent={maxOpenProposalsIntent}
          onChange={handleMaxOpenProposalsChange}
        />
      </FormGroup>

      <FormGroup
        label="Approvers"
        helperText={
          validApprovers
            ? "One address per line; duplicate addresses are ignored"
            : "Every address must be valid"
        }
        intent={approversIntent}
        labelFor="approvers"
      >
        <TextArea
          id="approvers"
          data-testid="approvers"
          className={Classes.MONOSPACE_TEXT}
          placeholder={
            "0x1111111111111111111111111111111111111111\n0x2222222222222222222222222222222222222222"
          }
          rows={10}
          fill
          required
          value={approvers}
          intent={approversIntent}
          onChange={handleApproversChange}
        />
      </FormGroup>

      <Button
        data-testid="create-tx"
        icon="tick"
        text="Create Transaction"
        intent={Intent.PRIMARY}
        style={commonStyles.rightGap}
        type="submit"
        disabled={createTxDisabled}
      />
      <AnchorButton text="Cancel" href={routes.configurations} />
    </form>
  );
}

function parseApprovers(text: string): string[] | null {
  const addresses = new Set<string>();

  for (const line of text.split("\n")) {
    const address = line.trim();
    const valid = isValidAddress(address);
    if (valid) {
      addresses.add(address);
    } else if (address.length > 0) {
      return null;
    }
  }

  return Array.from(addresses.values());
}
