import { Classes } from "@blueprintjs/core";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { StoresContext } from "../../contexts/StoresContext";
import { routes } from "../../routes";
import { initializeStores, Stores } from "../../stores";
import {
  DUMMY_CONTRACT,
  DUMMY_CONTRACT_2,
  VALID_ADDRESS,
  VALID_ADDRESS_2,
} from "../../test/fixtures";
import { toaster } from "../../toaster";
import { ConfigurationForm } from "./ConfigurationForm";

let stores: Stores;

beforeEach(() => {
  toaster.clear();
  localStorage.clear();
  document.location.assign(routes.addContract);
  stores = initializeStores();
  stores.contractStore.addContract(DUMMY_CONTRACT);
  stores.contractStore.addContract(DUMMY_CONTRACT_2);
});

function renderComponent() {
  return render(
    <StoresContext.Provider value={stores}>
      <ConfigurationForm />
    </StoresContext.Provider>
  );
}

test("Selecting a contract resets function selection", () => {
  const comp = renderComponent();
  const targetContractSelection = comp.getByTestId(
    "target-contract"
  ) as HTMLSelectElement;
  const selectorSelection = comp.getByTestId("selector") as HTMLSelectElement;

  // initially, nothing is selected
  expect(targetContractSelection.value).toEqual("");
  expect(selectorSelection.value).toEqual("");

  // select a contract
  fireEvent.change(targetContractSelection, {
    target: { value: DUMMY_CONTRACT.address },
  });
  expect(targetContractSelection.value).toEqual(DUMMY_CONTRACT.address);
  expect(selectorSelection.value).toEqual("");

  // select a selector
  fireEvent.change(selectorSelection, { target: { value: "0xd0679d34" } });
  expect(selectorSelection.value).toEqual("0xd0679d34");

  // changing contract selection...
  fireEvent.change(targetContractSelection, {
    target: { value: DUMMY_CONTRACT_2.address },
  });

  // resets selector selection
  expect(targetContractSelection.value).toEqual(DUMMY_CONTRACT_2.address);
  expect(selectorSelection.value).toEqual("");
});

test("Approvers validation", () => {
  const comp = renderComponent();
  const approversField = comp.getByTestId("approvers");

  fireEvent.change(approversField, { target: { value: "" } });
  expect(approversField.classList).not.toContain(Classes.INTENT_DANGER);

  fireEvent.change(approversField, { target: { value: "0x" } });
  expect(approversField.classList).toContain(Classes.INTENT_DANGER);

  fireEvent.change(approversField, { target: { value: VALID_ADDRESS } });
  expect(approversField.classList).not.toContain(Classes.INTENT_DANGER);

  fireEvent.change(approversField, { target: { value: `${VALID_ADDRESS}\n` } });
  expect(approversField.classList).not.toContain(Classes.INTENT_DANGER);

  fireEvent.change(approversField, {
    target: { value: `${VALID_ADDRESS}\n0` },
  });
  expect(approversField.classList).toContain(Classes.INTENT_DANGER);
  fireEvent.change(approversField, {
    target: { value: `${VALID_ADDRESS}\n${VALID_ADDRESS_2}` },
  });
  expect(approversField.classList).not.toContain(Classes.INTENT_DANGER);

  // empty lines do not matter
  fireEvent.change(approversField, {
    target: { value: `\n${VALID_ADDRESS}\n\n${VALID_ADDRESS_2}\n` },
  });
  expect(approversField.classList).not.toContain(Classes.INTENT_DANGER);
});

test("MinApprovals validation", () => {
  const comp = renderComponent();
  const minApprovalsField = comp.getByTestId("min-approvals");
  const minApprovalsFieldWrapper = minApprovalsField.parentElement;
  const approversField = comp.getByTestId("approvers");

  expect(minApprovalsFieldWrapper?.classList).toContain(Classes.INPUT_GROUP);

  // default value of 1 is accepted if approvers list is empty
  fireEvent.change(minApprovalsField, { target: { value: "1" } });
  expect(minApprovalsFieldWrapper?.classList).not.toContain(
    Classes.INTENT_DANGER
  );

  // minApprovals must be greater than 0
  fireEvent.change(minApprovalsField, { target: { value: "0" } });
  expect(minApprovalsFieldWrapper?.classList).toContain(Classes.INTENT_DANGER);

  fireEvent.change(approversField, { target: { value: VALID_ADDRESS } });

  // minApprovals can be less than the number of approvers
  fireEvent.change(minApprovalsField, { target: { value: "1" } });
  expect(minApprovalsFieldWrapper?.classList).not.toContain(
    Classes.INTENT_DANGER
  );

  // minApprovals must be less than the number of approvers
  fireEvent.change(minApprovalsField, { target: { value: "2" } });
  expect(minApprovalsFieldWrapper?.classList).toContain(Classes.INTENT_DANGER);

  // duplicate addresses still count as 1
  fireEvent.change(approversField, {
    target: { value: `${VALID_ADDRESS}\n${VALID_ADDRESS}` },
  });
  expect(minApprovalsFieldWrapper?.classList).toContain(Classes.INTENT_DANGER);

  // minApprovals can be equal to the number of approvers
  fireEvent.change(approversField, {
    target: { value: `${VALID_ADDRESS}\n${VALID_ADDRESS_2}` },
  });
  expect(minApprovalsFieldWrapper?.classList).not.toContain(
    Classes.INTENT_DANGER
  );
});

test("MaxOpenProposals validation", () => {
  const comp = renderComponent();
  const maxOpenProposalsField = comp.getByTestId("max-open-proposals");
  const maxOpenProposalsFieldWrapper = maxOpenProposalsField.parentElement;
  expect(maxOpenProposalsFieldWrapper?.classList).toContain(
    Classes.INPUT_GROUP
  );

  // any number greater than 1 and less than or equal to 100 is accepted
  [1, 2, 5, 99, 100].forEach((v) => {
    fireEvent.change(maxOpenProposalsField, {
      target: { value: v.toString() },
    });
    expect(maxOpenProposalsFieldWrapper?.classList).not.toContain(
      Classes.INTENT_DANGER
    );
  });

  // any other number is not valid
  [0, 101].forEach((v) => {
    fireEvent.change(maxOpenProposalsField, {
      target: { value: v.toString() },
    });
    expect(maxOpenProposalsFieldWrapper?.classList).toContain(
      Classes.INTENT_DANGER
    );
  });
});
