import { Classes } from "@blueprintjs/core";
import { fireEvent, queryByText, render } from "@testing-library/react";
import React from "react";
import { StoresContext } from "../../contexts/StoresContext";
import { routes } from "../../routes";
import { initializeStores, Stores } from "../../stores";
import {
  ContractData as ContractFormProps,
  ContractStore,
} from "../../stores/ContractStore";
import { DUMMY_CONTRACT } from "../../test/fixtures";
import { toaster } from "../../toaster";
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
  const addressFieldWrapper = addressField.parentElement;

  expect(addressFieldWrapper?.classList).toContain(Classes.INPUT_GROUP);

  // blank
  fireEvent.change(addressField, { target: { value: "" } });
  expect(addressFieldWrapper?.classList).not.toContain(Classes.INTENT_DANGER);

  // invalid address
  fireEvent.change(addressField, { target: { value: "0x" } });
  expect(addressFieldWrapper?.classList).toContain(Classes.INTENT_DANGER);

  // valid non-checksum address
  fireEvent.change(addressField, {
    target: { value: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
  });
  expect(addressFieldWrapper?.classList).not.toContain(Classes.INTENT_DANGER);

  // valid checksum address
  fireEvent.change(addressField, {
    target: { value: "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa" },
  });
  expect(addressFieldWrapper?.classList).not.toContain(Classes.INTENT_DANGER);

  // invalid checksum address
  fireEvent.change(addressField, {
    target: { value: "0xAAAAAAAAAAAAAAAAAAaaaaaaaaaaaaaaaaaaaaaa" },
  });
  expect(addressFieldWrapper?.classList).toContain(Classes.INTENT_DANGER);
});

test("ABI validation", () => {
  const comp = renderComponent();
  const abiField = comp.getByTestId("contract-abi") as HTMLTextAreaElement;

  // blank
  fireEvent.change(abiField, { target: { value: "" } });
  expect(abiField.classList).not.toContain(Classes.INTENT_DANGER);

  // invalid abi
  fireEvent.change(abiField, { target: { value: "[" } });
  expect(abiField.classList).toContain(Classes.INTENT_DANGER);

  fireEvent.change(abiField, { target: { value: `[{"type":"function"}]` } });
  expect(abiField.classList).toContain(Classes.INTENT_DANGER);

  // valid abi
  fireEvent.change(abiField, { target: { value: "[]" } });
  expect(abiField.classList).not.toContain(Classes.INTENT_DANGER);

  fireEvent.change(abiField, {
    target: { value: `[{"type":"function","name":"foo","inputs":[]}]` },
  });
  expect(abiField.classList).not.toContain(Classes.INTENT_DANGER);
});

test("Saving a new contract", () => {
  const comp = renderComponent();
  const addressField = comp.getByTestId("contract-address") as HTMLInputElement;
  const nameField = comp.getByTestId("contract-name") as HTMLInputElement;
  const abiField = comp.getByTestId("contract-abi") as HTMLTextAreaElement;
  const saveButton = comp.getByTestId("save") as HTMLButtonElement;

  expect(saveButton).toBeDisabled();
  fireEvent.change(addressField, {
    target: { value: DUMMY_CONTRACT.address.toLowerCase() },
  });
  expect(saveButton).toBeDisabled();
  fireEvent.change(nameField, { target: { value: DUMMY_CONTRACT.name } });
  expect(saveButton).toBeDisabled();
  fireEvent.change(abiField, { target: { value: DUMMY_CONTRACT.abi } });
  expect(saveButton).not.toBeDisabled();

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
