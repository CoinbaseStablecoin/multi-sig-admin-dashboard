import { Classes } from "@blueprintjs/core";
import { fireEvent, queryByText, render } from "@testing-library/react";
import React from "react";
import { StoresContext } from "../../contexts/StoresContext";
import { routes } from "../../routes";
import { initializeStores, Stores } from "../../stores";
import { TransactionStore } from "../../stores/TransactionStore";
import {
  DUMMY_CONTRACT,
  DUMMY_CONTRACT_2,
  DUMMY_CONTRACT_SELECTOR_1,
  VALID_ADDRESS,
  VALID_ADDRESS_2,
} from "../../test/fixtures";
import { toaster } from "../../toaster";
import { ConfigureTx } from "../../transactions/ConfigureTx";
import { Transaction } from "../../transactions/Transaction";
import { ConfigurationForm } from "./ConfigurationForm";

let stores: Stores;

beforeEach(() => {
  toaster.clear();
  localStorage.clear();
  document.location.assign(routes.addContract);
  stores = initializeStores();
  stores.contractStore.add(DUMMY_CONTRACT);
  stores.contractStore.add(DUMMY_CONTRACT_2);
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
  fireEvent.change(selectorSelection, {
    target: { value: DUMMY_CONTRACT_SELECTOR_1 },
  });
  expect(selectorSelection.value).toEqual(DUMMY_CONTRACT_SELECTOR_1);

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
  const approversField = comp.getByTestId("approvers") as HTMLTextAreaElement;

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
  const minApprovalsField = comp.getByTestId(
    "min-approvals"
  ) as HTMLInputElement;
  const minApprovalsFieldWrapper = minApprovalsField.parentElement;
  const approversField = comp.getByTestId("approvers") as HTMLTextAreaElement;

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
  const maxOpenProposalsField = comp.getByTestId(
    "max-open-proposals"
  ) as HTMLInputElement;
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

test("Create a configure transaction", () => {
  const comp = renderComponent();
  const targetContractSelection = comp.getByTestId(
    "target-contract"
  ) as HTMLSelectElement;
  const selectorSelection = comp.getByTestId("selector") as HTMLSelectElement;
  const minApprovalsField = comp.getByTestId(
    "min-approvals"
  ) as HTMLInputElement;
  const maxOpenProposalsField = comp.getByTestId(
    "max-open-proposals"
  ) as HTMLInputElement;
  const approversField = comp.getByTestId("approvers") as HTMLTextAreaElement;
  const createTxButton = comp.getByTestId("create-tx") as HTMLButtonElement;

  expect(createTxButton).toBeDisabled();
  fireEvent.change(targetContractSelection, {
    target: { value: DUMMY_CONTRACT.address },
  });
  fireEvent.change(selectorSelection, {
    target: { value: DUMMY_CONTRACT_SELECTOR_1 },
  });
  expect(createTxButton).toBeDisabled();
  fireEvent.change(minApprovalsField, { target: { value: "2" } });
  expect(createTxButton).toBeDisabled();
  fireEvent.change(maxOpenProposalsField, { target: { value: "10" } });
  expect(createTxButton).toBeDisabled();
  fireEvent.change(approversField, {
    target: { value: `${VALID_ADDRESS}\n${VALID_ADDRESS_2}` },
  });
  expect(createTxButton).not.toBeDisabled();

  fireEvent.click(createTxButton);

  // check that the toast message is displayed
  expect(queryByText(document.body, "Configure transaction created")).not.toBe(
    null
  );

  // check that the transaction is added to the store
  expect(stores.transactionStore.count()).toEqual(1);
  let transaction: Transaction | undefined = stores.transactionStore.all()[0];
  expect(transaction).toBeInstanceOf(ConfigureTx);
  let configTx = transaction as ConfigureTx;
  expect(configTx.id).toHaveLength(8);
  expect(typeof configTx.timestamp).toEqual("number");
  expect(configTx.targetContract).toEqual(DUMMY_CONTRACT.address);
  expect(configTx.selector).toEqual(DUMMY_CONTRACT_SELECTOR_1);
  expect(configTx.minApprovals).toEqual(2);
  expect(configTx.maxOpenProposals).toEqual(10);
  expect(configTx.approvers).toEqual([VALID_ADDRESS, VALID_ADDRESS_2]);

  // check that the transaction is persisted
  const restoredStore = new TransactionStore();
  restoredStore.load();
  expect(stores.transactionStore.count()).toEqual(1);
  transaction = restoredStore.all()[0];
  expect(transaction).toBeInstanceOf(ConfigureTx);
  configTx = transaction as ConfigureTx;
  expect(configTx.id).toHaveLength(8);
  expect(typeof configTx.timestamp).toEqual("number");
  expect(configTx.targetContract).toEqual(DUMMY_CONTRACT.address);
  expect(configTx.selector).toEqual(DUMMY_CONTRACT_SELECTOR_1);
  expect(configTx.minApprovals).toEqual(2);
  expect(configTx.maxOpenProposals).toEqual(10);
  expect(configTx.approvers).toEqual([VALID_ADDRESS, VALID_ADDRESS_2]);
});
