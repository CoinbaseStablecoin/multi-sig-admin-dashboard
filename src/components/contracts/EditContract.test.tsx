import { render } from "@testing-library/react";
import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { routes, stripHash } from "../../routes";
import { DUMMY_CONTRACT } from "../../test/fixtures";
import { StoresContext } from "../contexts/StoresContext";
import { initializeStores, Stores } from "../stores";
import { EditContract } from "./EditContract";

let stores: Stores;

beforeEach(() => {
  localStorage.clear();
  stores = initializeStores();
});

function renderComponent() {
  return render(
    <StoresContext.Provider value={stores}>
      <Router>
        <Route
          exact
          path={stripHash(routes.editContract(":address"))}
          component={EditContract}
        />
      </Router>
    </StoresContext.Provider>
  );
}

test("Render contract form when it exists", () => {
  stores.contractStore.addContract(DUMMY_CONTRACT);

  document.location.assign(routes.editContract(DUMMY_CONTRACT.address));

  const comp = renderComponent();
  const form = comp.queryByTestId("contract-form") as HTMLFormElement;
  expect(form).not.toBe(null);

  const addressField = comp.getByTestId("contract-address") as HTMLInputElement;
  const nameField = comp.getByTestId("contract-name") as HTMLInputElement;
  const abiField = comp.getByTestId("contract-abi") as HTMLTextAreaElement;

  expect(addressField).toHaveValue(DUMMY_CONTRACT.address);
  expect(nameField).toHaveValue(DUMMY_CONTRACT.name);
  expect(abiField).toHaveValue(DUMMY_CONTRACT.abi);
});

test("Render not found if the contract does not exist", () => {
  document.location.assign(routes.editContract(DUMMY_CONTRACT.address));

  const comp = renderComponent();
  const form = comp.queryByTestId("not-found") as HTMLFormElement;
  expect(form).not.toBe(null);
});
