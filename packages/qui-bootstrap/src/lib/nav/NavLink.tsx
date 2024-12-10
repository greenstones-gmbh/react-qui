import { PropsWithChildren } from "react";
import { Nav } from "react-bootstrap";
import { NavLinkProps } from "react-router-dom";
import { NavLink as AuthNavLink } from "@clickapp/qui-core";

export function NavLink({
  children,
  to,
  allowedRoles,
  end,
}: //...props
PropsWithChildren<
  NavLinkProps & { allowedRoles?: string; authenticated?: boolean }
>) {
  return (
    <Nav.Link
      as={AuthNavLink}
      to={to}
      allowedRoles={allowedRoles}
      className="link-body-emphasis1"
      end={end}
    >
      {children}
    </Nav.Link>
  );
}
