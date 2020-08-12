import React from "react";

export function ReactCSS(css: React.CSSProperties): React.CSSProperties {
  return css;
}

export const commonStyles = {
  leftGap: ReactCSS({
    marginLeft: 7,
  }),
  rightGap: ReactCSS({
    marginRight: 7,
  }),
};
