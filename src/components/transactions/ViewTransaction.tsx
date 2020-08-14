import { AnchorButton, Button, FormGroup, TextArea } from "@blueprintjs/core";
import React, { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useStores } from "../../hooks/useStores";
import { ConfigureTx } from "../../models/ConfigureTx";
import { routes } from "../../routes";
import { toaster } from "../../toaster";
import { commonStyles } from "../common/styles";
import { NotFound } from "../NotFound";
import { ViewConfigureTx } from "./ViewConfigureTx";

export function ViewTransaction(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  const { transactionStore } = useStores();
  const tx = transactionStore.get(id);

  const txParams = useMemo(() => {
    const params = tx?.params();
    return params ? JSON.stringify(params, null, 2) : "";
  }, [tx]);

  const handleCopyTxParams = useCallback(
    async (evt: React.MouseEvent) => {
      evt.preventDefault();
      await navigator.clipboard.writeText(txParams);
      toaster.show({ message: "Transaction parameters copied to clipboard" });
    },
    [txParams]
  );

  return tx ? (
    <>
      {tx instanceof ConfigureTx ? <ViewConfigureTx tx={tx} /> : null}
      <FormGroup label="Transaction Parameters" labelFor="tx-params">
        <Button
          icon="clipboard"
          text="Copy to Clipboard"
          style={commonStyles.bottomGap}
          onClick={handleCopyTxParams}
        />
        <TextArea id="tx-params" rows={10} fill readOnly value={txParams} />
      </FormGroup>

      <AnchorButton text="Back" href={routes.transactions} />
    </>
  ) : (
    <NotFound />
  );
}
