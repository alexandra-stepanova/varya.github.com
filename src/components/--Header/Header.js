import React from "react";

import { Header as GrommetHeader, ResponsiveContext } from "grommet";
import { Logo, Menu } from "@components";

/**
 * Header component based on Grommet Header
 *
 */
const Header = () => {
  return (
    <ResponsiveContext.Consumer>
      {(size) => (
        <GrommetHeader
          responsive
          pad="medium"
          height={size === "small" ? "48px" : "62px"}
          direction="row"
          fill="horizontal"
          elevation="medium"
        >
          <Logo size={size === "small" ? "small" : "medium"} />
          <Menu />
        </GrommetHeader>
      )}
    </ResponsiveContext.Consumer>
  );
};

export default Header;
