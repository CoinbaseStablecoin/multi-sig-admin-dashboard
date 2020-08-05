import { Button, H2 } from "@blueprintjs/core";
import React from "react";

function handleGoBack(): void {
  window.history.back();
}

export function NotFound(): JSX.Element {
  return (
    <div data-testid="not-found">
      <H2>Not Found</H2>
      <Button onClick={handleGoBack}>Go Back</Button>
    </div>
  );
}
