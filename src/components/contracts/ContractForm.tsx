import {
  AnchorButton,
  Button,
  Classes,
  FormGroup,
  InputGroup,
  Intent,
  TextArea,
} from "@blueprintjs/core";
import React, { useCallback, useState } from "react";
import { useStores } from "../../hooks/useStores";
import { routes } from "../../routes";
import { toaster } from "../../toaster";
import { isValidAbiJson } from "../../util/abi";
import { isValidAddress } from "../../util/address";
import { handleStringChange } from "../common/handlers";
import { commonStyles } from "../common/styles";

export interface ContractFormProps {
  address: string;
  name: string;
  abi: string;
}

export function ContractForm(props: ContractFormProps): JSX.Element {
  const { contractStore } = useStores();

  const [address, setAddress] = useState(props.address);
  const [name, setName] = useState(props.name);
  const [abi, setAbi] = useState(props.abi);

  const handleAddressChange = useCallback(handleStringChange(setAddress), []);
  const handleNameChange = useCallback(handleStringChange(setName), []);
  const handleAbiChange = useCallback(handleStringChange(setAbi), []);
  const handleSubmit = useCallback(
    (evt: React.FormEvent) => {
      evt.preventDefault();
      const contract = contractStore.add({ address, name, abi });
      contractStore.save();
      toaster.show({
        message: `Contract "${contract.name}" saved`,
        intent: "success",
      });
      document.location.assign(routes.contracts);
    },
    [address, name, abi, contractStore]
  );

  const validAddress = address.length === 0 || isValidAddress(address);
  const addressIntent = validAddress ? Intent.NONE : Intent.DANGER;

  const validAbiJson = abi.length === 0 || isValidAbiJson(abi);
  const abiIntent = validAbiJson ? Intent.NONE : Intent.DANGER;

  const saveDisabled = !address || !abi || !validAddress || !validAbiJson;

  return (
    <form data-testid="contract-form" onSubmit={handleSubmit}>
      <FormGroup
        label="Contract Address"
        labelInfo={props.address ? "" : "(required)"}
        helperText={
          validAddress
            ? "The address of the smart contract to manage"
            : "Invalid Ethereum address"
        }
        intent={addressIntent}
        labelFor="contract-address"
      >
        <InputGroup
          id="contract-address"
          data-testid="contract-address"
          className={Classes.MONOSPACE_TEXT}
          placeholder="0x1234abcd1234abcd1234abcd1234abcd1234abcd"
          required
          value={address}
          intent={addressIntent}
          onChange={handleAddressChange}
          readOnly={!!props.address}
        />
      </FormGroup>

      <FormGroup
        label="Contract Name"
        labelInfo="(required)"
        helperText="The name of the smart contract"
        labelFor="contract-name"
      >
        <InputGroup
          id="contract-name"
          data-testid="contract-name"
          placeholder="Awesome Contract"
          required
          value={name}
          onChange={handleNameChange}
        />
      </FormGroup>

      <FormGroup
        label="Contract ABI"
        labelInfo="(required)"
        helperText={
          validAbiJson
            ? "The ABI of the smart contract in the JSON format"
            : "Invalid ABI JSON"
        }
        intent={abiIntent}
        labelFor="contract-abi"
      >
        <TextArea
          id="contract-abi"
          className={Classes.MONOSPACE_TEXT}
          data-testid="contract-abi"
          placeholder="[{}]"
          rows={10}
          fill
          required
          value={abi}
          intent={abiIntent}
          onChange={handleAbiChange}
        />
      </FormGroup>

      <Button
        data-testid="save"
        icon="tick"
        text="Save"
        intent={Intent.PRIMARY}
        style={commonStyles.rightGap}
        type="submit"
        disabled={saveDisabled}
      />
      <AnchorButton text="Cancel" href={routes.contracts} />
    </form>
  );
}
