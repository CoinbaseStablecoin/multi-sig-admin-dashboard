import {
  fireEvent,
  getByTestId,
  getByText,
  render,
} from "@testing-library/react";
import React from "react";
import { routes } from "../../routes";
import { DUMMY_CONTRACT, DUMMY_CONTRACT_2 } from "../../test/fixtures";
import { toaster } from "../../toaster";
import { StoresContext } from "../contexts/StoresContext";
import { initializeStores, Stores } from "../stores";
import { Contracts } from "./Contracts";

let stores: Stores;

beforeEach(() => {
  toaster.clear();
  localStorage.clear();
  document.location.assign(routes.contracts);
  stores = initializeStores();
  stores.contractStore.addContract(DUMMY_CONTRACT);
  stores.contractStore.addContract(DUMMY_CONTRACT_2);
});

function renderComponent() {
  return render(
    <StoresContext.Provider value={stores}>
      <Contracts />
    </StoresContext.Provider>
  );
}

test("List", () => {
  const comp = renderComponent();
  const rows = comp.queryAllByTestId("contract-row");
  expect(rows).toHaveLength(2);

  expect(rows[0]).toHaveTextContent(DUMMY_CONTRACT.name);
  expect(rows[0]).toHaveTextContent(DUMMY_CONTRACT.address);

  expect(rows[1]).toHaveTextContent(DUMMY_CONTRACT_2.name);
  expect(rows[1]).toHaveTextContent(DUMMY_CONTRACT_2.address);
});

test("Edit button", () => {
  const comp = renderComponent();
  const rows = comp.queryAllByTestId("contract-row");
  expect(rows).toHaveLength(2);

  expect(
    getByTestId(rows[0], "contract-row-edit").getAttribute("href")
  ).toEqual(routes.editContract(DUMMY_CONTRACT.address));

  expect(
    getByTestId(rows[1], "contract-row-edit").getAttribute("href")
  ).toEqual(routes.editContract(DUMMY_CONTRACT_2.address));
});

test("Removing a contract", () => {
  const comp = renderComponent();

  expect(stores.contractStore.allContracts()).toHaveLength(2);
  expect(stores.contractStore.getContract(DUMMY_CONTRACT.address)).not.toBe(
    null
  );

  const rows = comp.queryAllByTestId("contract-row");
  expect(rows).toHaveLength(2);

  fireEvent.click(getByTestId(rows[0], "contract-row-remove"));

  const alertDialog = comp.baseElement.querySelector(".bp3-alert");
  expect(alertDialog).not.toBe(null);

  fireEvent.click(getByText(alertDialog as HTMLElement, "Remove"));

  expect(stores.contractStore.allContracts()).toHaveLength(1);
  expect(stores.contractStore.getContract(DUMMY_CONTRACT.address)).toBe(null);
});
