import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Box, Flex } from "reflexbox";
import { routes, stripHash } from "../routes";
import { Configurations } from "./configurations/Configurations";
import { AddContract } from "./contracts/AddContract";
import { Contracts } from "./contracts/Contracts";
import { Home } from "./home/Home";
import { Nav } from "./Nav";
import { Proposals } from "./proposals/Proposals";
import { Transactions } from "./transactions/Transactions";

const style: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export function App(): JSX.Element {
  return (
    <Flex className="App" flexDirection="column" style={style}>
      <Box flexShrink={0}>
        <Nav />
      </Box>
      <Box flexGrow={1} p={15}>
        <Router>
          <Switch>
            <Route exact path={stripHash(routes.home)} component={Home} />
            <Route
              exact
              path={stripHash(routes.contracts)}
              component={Contracts}
            />
            <Route
              exact
              path={stripHash(routes.addContract)}
              component={AddContract}
            />
            <Route
              exact
              path={stripHash(routes.configurations)}
              component={Configurations}
            />
            <Route
              exact
              path={stripHash(routes.proposals)}
              component={Proposals}
            />
            <Route
              exact
              path={stripHash(routes.transactions)}
              component={Transactions}
            />
          </Switch>
        </Router>
      </Box>
    </Flex>
  );
}
