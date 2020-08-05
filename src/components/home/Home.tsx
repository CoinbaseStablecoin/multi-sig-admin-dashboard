import React from "react";
import { routes } from "../../routes";

export function Home(): JSX.Element {
  document.location.replace(routes.contracts);
  return <></>;
}
