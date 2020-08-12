import { configure } from "mobx";
import React from "react";
import { Box, Flex } from "reflexbox";
import { StoresContext } from "../contexts/StoresContext";
import { defaultStores } from "../stores";
import { AppRouter } from "./AppRouter";
import { ReactCSS } from "./common/styles";
import { Nav } from "./Nav";

configure({ enforceActions: "always" });

defaultStores.contractStore.restore();

const style = ReactCSS({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

export function App(): JSX.Element {
  return (
    <StoresContext.Provider value={defaultStores}>
      <Flex className="App" flexDirection="column" style={style}>
        <Box flexShrink={0}>
          <Nav />
        </Box>
        <Box flexGrow={1} p={15}>
          <AppRouter />
        </Box>
      </Flex>
    </StoresContext.Provider>
  );
}
