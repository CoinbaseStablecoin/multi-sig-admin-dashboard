import { H2 } from "@blueprintjs/core";
import React from "react";
import { ConfigurationForm } from "./ConfigurationForm";

export function NewConfiguration(): JSX.Element {
  return (
    <>
      <H2>New Configuration</H2>
      <ConfigurationForm />
    </>
  );
}
