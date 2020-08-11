import { AnchorButton, H2 } from "@blueprintjs/core";
import React from "react";
import { Box, Flex } from "reflexbox";
import { routes } from "../../routes";

export function Configurations(): JSX.Element {
  return (
    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between">
      <Box>
        <H2>Configurations</H2>
      </Box>
      <Box>
        <AnchorButton
          icon="add"
          text="New Configuration"
          href={routes.newConfiguration}
        />
      </Box>
    </Flex>
  );
}
