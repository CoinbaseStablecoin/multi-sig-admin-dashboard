import { fireEvent, queryByText, render } from "@testing-library/react";
import React from "react";
import { routes } from "../../routes";
import { toaster } from "../../toaster";
import { StoresContext } from "../contexts/StoresContext";
import { initializeStores, Stores } from "../stores";
import { AddContract } from "./AddContract";

let stores: Stores;

beforeEach(() => {
  toaster.clear();
  document.location.assign("/#/contracts/add");
  stores = initializeStores();
});

function renderComponent() {
  return render(
    <StoresContext.Provider value={stores}>
      <AddContract />
    </StoresContext.Provider>
  );
}

test("render", () => {
  renderComponent();
});

test("address validation", () => {
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

test("Save", () => {
  const comp = renderComponent();
  const addressField = comp.getByTestId("contract-address") as HTMLInputElement;
  const nameField = comp.getByTestId("contract-name") as HTMLInputElement;
  const abiField = comp.getByTestId("contract-abi") as HTMLTextAreaElement;
  const saveButton = comp.getByTestId("save") as HTMLButtonElement;

  fireEvent.change(addressField, {
    target: { value: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" },
  });
  fireEvent.change(nameField, { target: { value: "PeteCoin" } });
  fireEvent.change(abiField, {
    target: { value: `[{"type":"function","name":"foo","inputs":[]}]` },
  });

  expect(stores.contractStore.contracts).toHaveLength(0);

  fireEvent.click(saveButton);

  expect(queryByText(document.body, `Contract "PeteCoin" saved`)).not.toBe(
    null
  );

  expect(stores.contractStore.contracts).toHaveLength(1);
  const [contract] = stores.contractStore.contracts;
  expect(contract.address).toEqual(
    "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa"
  );
  expect(contract.name).toEqual("PeteCoin");
  expect(contract.abi).toEqual([{ type: "function", name: "foo", inputs: [] }]);

  expect(document.location.hash).toEqual(routes.contracts);
});
