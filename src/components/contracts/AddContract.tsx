import {
  AnchorButton,
  Button,
  FormGroup,
  H2,
  InputGroup,
  TextArea,
} from "@blueprintjs/core";
import React, { useCallback, useState } from "react";
import { routes } from "../../routes";
import { isValidAbiJson } from "../../util/abi";
import { isAddressValid } from "../../util/address";

const addButtonStyle: React.CSSProperties = {
  marginRight: 10,
};

function handleInputChange(setter: (value: string) => void) {
  return (evt: React.ChangeEvent<HTMLElement>) => {
    setter((evt.target as HTMLInputElement).value);
  };
}

export function AddContract(): JSX.Element {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [abi, setAbi] = useState("");

  const handleAddressChange = useCallback(handleInputChange(setAddress), []);
  const handleNameChange = useCallback(handleInputChange(setName), []);
  const handleAbiChange = useCallback(handleInputChange(setAbi), []);

  const validAddress = address.length === 0 || isAddressValid(address);
  const addressIntent = validAddress ? "none" : "danger";

  const validAbiJson = abi.length === 0 || isValidAbiJson(abi);
  const abiIntent = validAbiJson ? "none" : "danger";

  return (
    <form>
      <H2>Add Contract</H2>

      <FormGroup
        label="Contract Address"
        labelInfo="(required)"
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
          placeholder="0x1234abcd1234abcd1234abcd1234abcd1234abcd"
          required
          value={address}
          intent={addressIntent}
          onChange={handleAddressChange}
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
        icon="tick"
        text="Save"
        intent="primary"
        style={addButtonStyle}
        type="submit"
      />
      <AnchorButton text="Cancel" href={routes.contracts} />
    </form>
  );
}
