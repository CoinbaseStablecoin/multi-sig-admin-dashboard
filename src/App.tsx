import { Alignment, AnchorButton, Button, Navbar } from "@blueprintjs/core";
import React from "react";
import { Box, Flex } from "reflexbox";
import "./App.scss";
import { CONTRACT_ADDRESS, NETWORK } from "./config";
import { etherscanAddress, shortenEthereumAddress } from "./util/address";

export function App(): JSX.Element {
  return (
    <div className="App">
      <Navbar className="App-Navbar">
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Box>
            <Navbar.Group align={Alignment.LEFT}>
              <Navbar.Heading>MultiSigAdmin</Navbar.Heading>
              <Navbar.Divider />
              <Button minimal icon="settings" text="Configuration" />
              <Button minimal icon="document" text="Proposals" />
            </Navbar.Group>
          </Box>
          <Box>
            <Navbar.Group align={Alignment.RIGHT}>
              <Navbar.Divider />
              <AnchorButton
                minimal
                rightIcon="share"
                text={`Contract: ${shortenEthereumAddress(CONTRACT_ADDRESS)} (${
                  NETWORK.name
                })`}
                href={etherscanAddress(CONTRACT_ADDRESS, NETWORK)}
                target="_blank"
                rel="noopener noreferrer"
              />
            </Navbar.Group>
          </Box>
        </Flex>
      </Navbar>
    </div>
  );
}
