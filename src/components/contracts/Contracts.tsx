import { AnchorButton, H2, HTMLTable } from "@blueprintjs/core";
import React from "react";
import { Box, Flex } from "reflexbox";
import { NETWORK } from "../../config";
import { routes } from "../../routes";
import { getFunctions } from "../../util/abi";
import { etherscanAddress } from "../../util/address";
import { useStores } from "../hooks/useStores";

const tableStyle: React.CSSProperties = {
  marginTop: 10,
  width: "100%",
};

export function Contracts(): JSX.Element {
  const { contractStore } = useStores();

  const contracts = Array.from(contractStore.contracts.values());

  return (
    <div>
      <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between">
        <Box>
          <H2>Contracts</H2>
        </Box>
        <Box>
          <AnchorButton
            icon="add"
            text="Add Contract"
            href={routes.addContract}
          />
        </Box>
      </Flex>
      <HTMLTable striped style={tableStyle}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Address</td>
            <td># Functions</td>
          </tr>
        </thead>
        <tbody>
          {contracts.length === 0 ? (
            <tr>
              <td colSpan={4}>(empty)</td>
            </tr>
          ) : (
            contracts.map((contract, i) => (
              <tr key={i}>
                <td>{contract.name}</td>
                <td>
                  <a
                    href={etherscanAddress(contract.address, NETWORK.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contract.address}
                  </a>
                </td>
                <td>{getFunctions(contract.abi).length}</td>
              </tr>
            ))
          )}
        </tbody>
      </HTMLTable>
    </div>
  );
}
