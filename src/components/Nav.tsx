import {
  Alignment,
  AnchorButton,
  ButtonGroup,
  Navbar,
  Tag,
} from "@blueprintjs/core";
import React from "react";
import { Box, Flex } from "reflexbox";
import { CONTRACT_ADDRESS, NETWORK } from "../config";
import { useStores } from "../hooks/useStores";
import { routes } from "../routes";
import { etherscanAddress, shortenAddress } from "../util/address";
import { commonStyles, ReactCSS } from "./common/styles";

const style = ReactCSS({
  height: "auto",
});

export function Nav(): JSX.Element {
  const { transactionStore } = useStores();

  const transactionCount = transactionStore.count();

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
            <ButtonGroup>
              <AnchorButton
                icon="code"
                text="Contracts"
                href={routes.contracts}
              />
              <AnchorButton
                icon="settings"
                text="Configurations"
                href={routes.configurations}
              />
              <AnchorButton
                icon="document"
                text="Proposals"
                href={routes.proposals}
              />
              <AnchorButton
                icon="exchange"
                text="Transactions"
                href={routes.transactions}
              >
                {transactionCount > 0 ? (
                  <Tag style={commonStyles.leftGap} round>
                    {transactionCount}
                  </Tag>
                ) : null}
              </AnchorButton>
            </ButtonGroup>
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
