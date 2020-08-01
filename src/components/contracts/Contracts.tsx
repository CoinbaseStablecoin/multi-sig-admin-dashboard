import { AnchorButton, H2 } from "@blueprintjs/core";
import React from "react";
import { routes } from "../../routes";

export function Contracts(): JSX.Element {
  return (
    <div>
      <H2>Contracts</H2>
      <AnchorButton icon="add" text="Add Contract" href={routes.addContract} />
    </div>
  );
}
