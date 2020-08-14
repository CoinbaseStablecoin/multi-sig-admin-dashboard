import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { routes, stripHash } from "../routes";
import { Configurations } from "./configurations/Configurations";
import { NewConfiguration } from "./configurations/NewConfiguration";
import { AddContract } from "./contracts/AddContract";
import { Contracts } from "./contracts/Contracts";
import { EditContract } from "./contracts/EditContract";
import { Home } from "./home/Home";
import { Proposals } from "./proposals/Proposals";
import { Transactions } from "./transactions/Transactions";
import { ViewTransaction } from "./transactions/ViewTransaction";

export function AppRouter(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path={stripHash(routes.home)} component={Home} />
        <Route exact path={stripHash(routes.contracts)} component={Contracts} />
        <Route
          exact
          path={stripHash(routes.addContract)}
          component={AddContract}
        />
        <Route
          exact
          path={stripHash(routes.editContract(":address"))}
          component={EditContract}
        />
        <Route
          exact
          path={stripHash(routes.configurations)}
          component={Configurations}
        />
        <Route
          exact
          path={stripHash(routes.newConfiguration)}
          component={NewConfiguration}
        />
        <Route exact path={stripHash(routes.proposals)} component={Proposals} />
        <Route
          exact
          path={stripHash(routes.transactions)}
          component={Transactions}
        />
        <Route
          exact
          path={stripHash(routes.viewTransaction(":id"))}
          component={ViewTransaction}
        />
      </Switch>
    </Router>
  );
}
