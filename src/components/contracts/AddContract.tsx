import {
  AnchorButton,
  Button,
  FormGroup,
  H2,
  InputGroup,
  TextArea,
} from "@blueprintjs/core";
import React from "react";
import { routes } from "../../routes";

const addButtonStyle: React.CSSProperties = {
  marginRight: 10,
};

export function AddContract(): JSX.Element {
  return (
    <form>
      <H2>Add Contract</H2>

      <FormGroup
        label="Contract Address"
        labelInfo="(required)"
        helperText="The address of the smart contract to manage"
        labelFor="contract-address"
      >
        <InputGroup
          id="contract-address"
          placeholder="0x1234abcd1234abcd1234abcd1234abcd1234abcd"
          required
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
        />
      </FormGroup>

      <FormGroup
        label="Contract ABI"
        labelInfo="(required)"
        helperText="The ABI of the smart contract in the JSON format"
        labelFor="contract-abi"
      >
        <TextArea
          id="contract-abi"
          placeholder="[{}]"
          rows={10}
          fill
          required
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
