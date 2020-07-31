import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Box, Flex } from "reflexbox";
import { routes, stripHash } from "../routes";
import "./App.scss";
import { Configurations } from "./configurations/Configurations";
import { Contracts } from "./contracts/Contracts";
import { Home } from "./home/Home";
import { Nav } from "./Nav";
import { Proposals } from "./proposals/Proposals";
import { Transactions } from "./transactions/Transactions";

export function App(): JSX.Element {
  return (
    <Flex className="App" flexDirection="column">
      <Box flexShrink={0}>
        <Nav />
      </Box>
      <Box flexGrow={1}>
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
