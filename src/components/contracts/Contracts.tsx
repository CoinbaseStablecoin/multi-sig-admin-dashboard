import {
  Alert,
  AnchorButton,
  Button,
  H2,
  HTMLTable,
  Intent,
} from "@blueprintjs/core";
import React, { useCallback, useState } from "react";
import { Box, Flex } from "reflexbox";
import { NETWORK } from "../../config";
import { routes } from "../../routes";
import { getFunctions } from "../../util/abi";
import { etherscanAddress } from "../../util/address";
import { useStores } from "../hooks/useStores";
import { Contract } from "../stores/ContractStore";

const styles: { [name: string]: React.CSSProperties } = {
  table: {
    marginTop: 10,
    width: "100%",
  },
  thead: {
    whiteSpace: "nowrap",
  },
  actions: {
    width: "1%",
    whiteSpace: "nowrap",
  },
  editButton: {
    marginRight: 10,
  },
};

export function Contracts(): JSX.Element {
  const { contractStore } = useStores();
  const [contractToRemove, setContractToRemove] = useState<Contract | null>(
    null
  );

  const handleRemoveClick = useCallback((contract: Contract) => {
    setContractToRemove(contract);
  }, []);

  const handleRemoveCancelClick = useCallback(() => {
    setContractToRemove(null);
  }, []);

  const handleRemoveConfirmClick = useCallback(() => {
    if (contractToRemove) {
      contractStore.removeContract(contractToRemove.address);
      contractStore.persist();
      setContractToRemove(null);
    }
  }, [contractStore, contractToRemove]);

  const contracts = contractStore.allContracts();

  return (
    <div>
      <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between">
        <Box>
          <H2>Contracts</H2>
        </Box>
        <Box>
          <AnchorButton
            icon="add"
            text="Add Contract"
            href={routes.addContract}
          />
        </Box>
      </Flex>
      <HTMLTable striped style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <td>Name</td>
            <td>Address</td>
            <td># Functions</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td colSpan={4}>(empty)</td>
            </tr>
          ) : (
            contracts.map((contract) => (
              <ContractRow
                key={contract.address}
                contract={contract}
                onRemoveClick={handleRemoveClick}
              />
            ))
          )}
        </tbody>
      </HTMLTable>
      <Alert
        cancelButtonText="Don't Remove"
        confirmButtonText="Remove"
        icon="trash"
        intent={Intent.DANGER}
        isOpen={!!contractToRemove}
        canEscapeKeyCancel
        onCancel={handleRemoveCancelClick}
        onConfirm={handleRemoveConfirmClick}
      >
        <p>
          Are you sure you want to remove{" "}
          <strong>"{contractToRemove?.name}"</strong>?
        </p>
        <p>
          It will be removed only from this dashboard, and it can be added
          again.
        </p>
      </Alert>
    </div>
  );
}

function ContractRow(props: {
  contract: Contract;
  onRemoveClick: (contract: Contract) => void;
}): JSX.Element {
  const { contract, onRemoveClick } = props;
  const { address, name, abi } = contract;

  const handleRemoveClick = useCallback(() => {
    onRemoveClick(contract);
  }, [onRemoveClick, contract]);

  return (
    <tr data-testid="contract-row">
      <td>{name}</td>
      <td>
        <a
          href={etherscanAddress(address, NETWORK.name)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {address}
        </a>
      </td>
      <td>{getFunctions(abi).length}</td>
      <td style={styles.actions}>
        <AnchorButton
          icon="edit"
          text="Edit"
          style={styles.editButton}
          href={routes.editContract(address)}
          data-testid="contract-row-edit"
        />
        <Button
          icon="trash"
          text="Remove"
          intent={Intent.DANGER}
          onClick={handleRemoveClick}
          data-testid="contract-row-remove"
        />
      </td>
    </tr>
  );
}
