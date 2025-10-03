import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import * as React from "react";

export default function NavbarBrand(): React.ReactElement {
  const logoUrl = useBaseUrl("/img/logo.svg");

  return (
    <Link to="/" className="navbar__brand">
      <img
        src={logoUrl}
        alt="Phoenix Rooivalk"
        className="phoenix-logo"
        width="40"
        height="40"
      />
      <span className="navbar__brand-text">Phoenix Rooivalk</span>
    </Link>
  );
}
