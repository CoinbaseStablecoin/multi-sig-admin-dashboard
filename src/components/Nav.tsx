import { Alignment, AnchorButton, Navbar } from "@blueprintjs/core";
import React from "react";
import { Box, Flex } from "reflexbox";
import { CONTRACT_ADDRESS, NETWORK } from "../config";
import { routes } from "../routes";
import { etherscanAddress, shortenAddress } from "../util/address";
import { ReactCSS } from "./common/styles";

const style = ReactCSS({
  height: "auto",
});

export function Nav(): JSX.Element {
  return (
    <Navbar style={style}>
      <Flex flexDirection="row" justifyContent="space-between" flexWrap="wrap">
        <Box>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>
              <AnchorButton
                minimal
                large
                text="MultiSigAdmin"
                href={routes.home}
              />
            </Navbar.Heading>
            <AnchorButton
              minimal
              icon="code"
              text="Contracts"
              href={routes.contracts}
            />
            <AnchorButton
              minimal
              icon="settings"
              text="Configurations"
              href={routes.configurations}
            />
            <AnchorButton
              minimal
              icon="document"
              text="Proposals"
              href={routes.proposals}
            />
            <AnchorButton
              minimal
              icon="exchange"
              text="Transactions"
              href={routes.transactions}
            />
          </Navbar.Group>
        </Box>
        <Box>
          <Navbar.Group align={Alignment.RIGHT}>
            <AnchorButton
              minimal
              rightIcon="share"
              text={`Contract: ${shortenAddress(CONTRACT_ADDRESS)} (${
                NETWORK.name
              })`}
              href={etherscanAddress(CONTRACT_ADDRESS, NETWORK.name)}
              target="_blank"
              rel="noopener noreferrer"
            />
          </Navbar.Group>
        </Box>
      </Flex>
    </Navbar>
  );
}
