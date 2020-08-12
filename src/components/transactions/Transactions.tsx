import { H2, HTMLTable } from "@blueprintjs/core";
import React from "react";
import { Box, Flex } from "reflexbox";
import { useStores } from "../../hooks/useStores";
import { Transaction } from "../../transactions/Transaction";
import { toDate } from "../../util/timestamp";
import { ReactCSS } from "../common/styles";

const styles = {
  table: ReactCSS({
    marginTop: 10,
    width: "100%",
  }),
  thead: ReactCSS({
    whiteSpace: "nowrap",
  }),
};

export function Transactions(): JSX.Element {
  const { transactionStore } = useStores();
  const transactions = transactionStore.allTransactions();

  return (
    <Box>
      <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between">
        <Box>
          <H2>Transactions</H2>
        </Box>
      </Flex>
      <HTMLTable striped style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th>Type</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </tbody>
      </HTMLTable>
    </Box>
  );
}

function TransactionRow({ tx }: { tx: Transaction }): JSX.Element {
  return (
    <tr>
      <td>{(tx.constructor as typeof Transaction).type}</td>
      <td>{toDate(tx.timestamp).toLocaleString()}</td>
      <td></td>
    </tr>
  );
}
