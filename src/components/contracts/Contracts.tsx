import {
  Alert,
  AnchorButton,
  Button,
  Classes,
  H2,
  HTMLTable,
  Intent,
} from "@blueprintjs/core";
import React, { useCallback, useState } from "react";
import { Box, Flex } from "reflexbox";
import { NETWORK } from "../../config";
import { useStores } from "../../hooks/useStores";
import { routes } from "../../routes";
import { Contract } from "../../stores/ContractStore";
import { getTransactableFunctions } from "../../util/abi";
import { etherscanAddress } from "../../util/address";
import { commonStyles, ReactCSS } from "../common/styles";

const styles = {
  table: ReactCSS({
    marginTop: 10,
    width: "100%",
  }),
  thead: ReactCSS({
    whiteSpace: "nowrap",
  }),
  actions: ReactCSS({
    width: "1%",
    whiteSpace: "nowrap",
  }),
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
      contractStore.remove(contractToRemove.address);
      contractStore.save();
      setContractToRemove(null);
    }
  }, [contractStore, contractToRemove]);

  const contracts = contractStore.all();

  return (
    <Box>
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
            <th>Name</th>
            <th>Address</th>
            <th># Functions</th>
            <th>Actions</th>
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
    </Box>
  );
}

function ContractRow({
  contract,
  onRemoveClick,
}: {
  contract: Contract;
  onRemoveClick: (contract: Contract) => void;
}): JSX.Element {
  const { address, name, abi } = contract;

  const handleRemoveClick = useCallback(() => {
    onRemoveClick(contract);
  }, [onRemoveClick, contract]);

  return (
    <tr data-testid="contract-row">
      <td>{name}</td>
      <td>
        <a
          className={Classes.MONOSPACE_TEXT}
          href={etherscanAddress(address, NETWORK.name)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {address}
        </a>
      </td>
      <td>{getTransactableFunctions(abi).length}</td>
      <td style={styles.actions}>
        <AnchorButton
          icon="edit"
          text="Edit"
          style={commonStyles.rightGap}
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
