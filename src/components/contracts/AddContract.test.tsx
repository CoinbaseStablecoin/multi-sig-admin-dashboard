import { render } from "@testing-library/react";
import React from "react";
import { StoresContext } from "../../contexts/StoresContext";
import { initializeStores } from "../../stores";
import { AddContract } from "./AddContract";

test("Render contract form", () => {
  const comp = render(
    <StoresContext.Provider value={initializeStores()}>
      <AddContract />
    </StoresContext.Provider>
  );

  const form = comp.queryByTestId("contract-form") as HTMLFormElement;
  expect(form).not.toBe(null);

  const addressField = comp.getByTestId("contract-address") as HTMLInputElement;
  const nameField = comp.getByTestId("contract-name") as HTMLInputElement;
  const abiField = comp.getByTestId("contract-abi") as HTMLTextAreaElement;

  expect(addressField).toHaveValue("");
  expect(nameField).toHaveValue("");
  expect(abiField).toHaveValue("");
});
