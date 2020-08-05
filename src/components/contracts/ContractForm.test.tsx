import { fireEvent, queryByText, render } from "@testing-library/react";
import React from "react";
import { routes } from "../../routes";
import { DUMMY_CONTRACT } from "../../test/fixtures";
import { toaster } from "../../toaster";
import { StoresContext } from "../contexts/StoresContext";
import { initializeStores, Stores } from "../stores";
import {
  ContractData as ContractFormProps,
  ContractStore,
} from "../stores/ContractStore";
import { ContractForm } from "./ContractForm";

let stores: Stores;

beforeEach(() => {
  toaster.clear();
  localStorage.clear();
  document.location.assign(routes.addContract);
  stores = initializeStores();
});

function renderComponent(
  props: ContractFormProps = { address: "", name: "", abi: "" }
) {
  return render(
    <StoresContext.Provider value={stores}>
      <ContractForm {...props} />
    </StoresContext.Provider>
  );
}

test("Address validation", () => {
  const comp = renderComponent();
  const addressField = comp.getByTestId("contract-address") as HTMLInputElement;
  const saveButton = comp.getByTestId("save") as HTMLButtonElement;

  // blank
  fireEvent.change(addressField, { target: { value: "" } });
  expect(comp.queryByText("Invalid Ethereum address")).toBe(null);
  expect(saveButton).not.toBeDisabled();

  // invalid address
  fireEvent.change(addressField, { target: { value: "0x" } });
  expect(comp.queryByText("Invalid Ethereum address")).not.toBe(null);
  expect(saveButton).toBeDisabled();

  // valid non-checksum address
  fireEvent.change(addressField, {
    target: { value: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
  });
  expect(comp.queryByText("Invalid Ethereum address")).toBe(null);
  expect(saveButton).not.toBeDisabled();

  // valid checksum address
  fireEvent.change(addressField, {
    target: { value: "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa" },
  });
  expect(comp.queryByText("Invalid Ethereum address")).toBe(null);
  expect(saveButton).not.toBeDisabled();

  // invalid checksum address
  fireEvent.change(addressField, {
    target: { value: "0xAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaa" },
  });
  expect(comp.queryByText("Invalid Ethereum address")).not.toBe(null);
  expect(saveButton).toBeDisabled();
});

test("ABI validation", () => {
  const comp = renderComponent();
  const abiField = comp.getByTestId("contract-abi") as HTMLTextAreaElement;
  const saveButton = comp.getByTestId("save") as HTMLButtonElement;

  // blank
  fireEvent.change(abiField, { target: { value: "" } });
  expect(comp.queryByText("Invalid ABI JSON")).toBe(null);
  expect(saveButton).not.toBeDisabled();

  // invalid abi
  fireEvent.change(abiField, { target: { value: "[" } });
  expect(comp.queryByText("Invalid ABI JSON")).not.toBe(null);
  expect(saveButton).toBeDisabled();

  fireEvent.change(abiField, { target: { value: `[{"type":"function"}]` } });
  expect(comp.queryByText("Invalid ABI JSON")).not.toBe(null);
  expect(saveButton).toBeDisabled();

  // valid abi
  fireEvent.change(abiField, { target: { value: "[]" } });
  expect(comp.queryByText("Invalid ABI JSON")).toBe(null);
  expect(saveButton).not.toBeDisabled();

  fireEvent.change(abiField, {
    target: { value: `[{"type":"function","name":"foo","inputs":[]}]` },
  });
  expect(comp.queryByText("Invalid ABI JSON")).toBe(null);
  expect(saveButton).not.toBeDisabled();
});

test("Saving a new contract", () => {
  const comp = renderComponent();
  const addressField = comp.getByTestId("contract-address") as HTMLInputElement;
  const nameField = comp.getByTestId("contract-name") as HTMLInputElement;
  const abiField = comp.getByTestId("contract-abi") as HTMLTextAreaElement;
  const saveButton = comp.getByTestId("save") as HTMLButtonElement;

  fireEvent.change(addressField, {
    target: { value: DUMMY_CONTRACT.address.toLowerCase() },
  });
  fireEvent.change(nameField, { target: { value: DUMMY_CONTRACT.name } });
  fireEvent.change(abiField, { target: { value: DUMMY_CONTRACT.abi } });

  fireEvent.click(saveButton);

  // check that the toast message is displayed
  expect(
    queryByText(document.body, `Contract "${DUMMY_CONTRACT.name}" saved`)
  ).not.toBe(null);

  // check that the contract is added to the store
  expect(stores.contractStore.allContracts().length).toEqual(1);
  let contract = stores.contractStore.getContract(DUMMY_CONTRACT.address);
  expect(contract?.address).toEqual(DUMMY_CONTRACT.address);
  expect(contract?.name).toEqual(DUMMY_CONTRACT.name);
  expect(contract?.abi).toEqual(JSON.parse(DUMMY_CONTRACT.abi));

  // check that the contract is persisted
  const restoredStore = new ContractStore();
  restoredStore.restore();
  expect(restoredStore.allContracts().length).toEqual(1);
  contract = restoredStore.getContract(DUMMY_CONTRACT.address);
  expect(contract?.address).toEqual(DUMMY_CONTRACT.address);
  expect(contract?.name).toEqual(DUMMY_CONTRACT.name);
  expect(contract?.abi).toEqual(JSON.parse(DUMMY_CONTRACT.abi));

  // check that it navigates to the contract list page
  expect(document.location.hash).toEqual(routes.contracts.slice(1));
});

test("Updating an existing contract", () => {
  stores.contractStore.addContract(DUMMY_CONTRACT);

  const comp = renderComponent(DUMMY_CONTRACT);
  const addressField = comp.getByTestId("contract-address") as HTMLInputElement;
  const nameField = comp.getByTestId("contract-name") as HTMLInputElement;
  const abiField = comp.getByTestId("contract-abi") as HTMLTextAreaElement;
  const saveButton = comp.getByTestId("save") as HTMLButtonElement;

  expect(addressField).toHaveValue(DUMMY_CONTRACT.address);
  expect(addressField.readOnly).toBe(true);
  expect(nameField).toHaveValue(DUMMY_CONTRACT.name);
  expect(abiField).toHaveValue(DUMMY_CONTRACT.abi);

  fireEvent.change(nameField, { target: { value: "PeteCoin V2" } });
  fireEvent.change(abiField, {
    target: { value: `[{"type":"function","name":"bar","inputs":[]}]` },
  });

  fireEvent.click(saveButton);

  // check that the toast message is displayed
  expect(queryByText(document.body, `Contract "PeteCoin V2" saved`)).not.toBe(
    null
  );

  // check that the contract is updated
  expect(stores.contractStore.allContracts().length).toEqual(1);
  let contract = stores.contractStore.getContract(DUMMY_CONTRACT.address);
  expect(contract?.address).toEqual(DUMMY_CONTRACT.address);
  expect(contract?.name).toEqual("PeteCoin V2");
  expect(contract?.abi).toEqual([
    { type: "function", name: "bar", inputs: [] },
  ]);

  // check that the contract is persisted
  const restoredStore = new ContractStore();
  restoredStore.restore();
  expect(restoredStore.allContracts().length).toEqual(1);
  contract = restoredStore.getContract(DUMMY_CONTRACT.address);
  expect(contract?.address).toEqual(DUMMY_CONTRACT.address);
  expect(contract?.name).toEqual("PeteCoin V2");
  expect(contract?.abi).toEqual([
    { type: "function", name: "bar", inputs: [] },
  ]);

  // check that it navigates to the contract list page
  expect(document.location.hash).toEqual(routes.contracts.slice(1));
});
