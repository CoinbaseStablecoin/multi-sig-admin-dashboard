import { AnchorButton, Button, H2, HTMLTable, Intent } from "@blueprintjs/core";
import React from "react";
import { Box, Flex } from "reflexbox";
import { useStores } from "../../hooks/useStores";
import { Transaction } from "../../models/Transaction";
import { routes } from "../../routes";
import { toDate } from "../../util/timestamp";
import { commonStyles, ReactCSS } from "../common/styles";

const styles = {
  table: ReactCSS({
    marginTop: 10,
    width: "100%",
  }),
  thead: ReactCSS({
    whiteSpace: "nowrap",
  }),
  actions: ReactCSS({
    width: "1%",
    whiteSpace: "nowrap",
  }),
};

export function Transactions(): JSX.Element {
  const { transactionStore } = useStores();
  const transactions = transactionStore.all();

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
      <td style={styles.actions}>
        <AnchorButton
          icon="eye-open"
          text="Show"
          style={commonStyles.rightGap}
          href={routes.viewTransaction(tx.id)}
        />
        <Button icon="trash" text="Remove" intent={Intent.DANGER} />
      </td>
    </tr>
  );
}
