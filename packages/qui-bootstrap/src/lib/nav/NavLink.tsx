import type { PropsWithChildren } from "react";
import { Nav } from "react-bootstrap";
import type { NavLinkProps } from "react-router-dom";
import { NavLink as AuthNavLink } from "@clickapp/qui-core";
import classNames from "classnames";
import "./NavLink.css";

export function NavLink({
  children,
  to,
  allowedRoles,
  end,
  className,
  text,
  icon: Icon,
}: //...props
PropsWithChildren<
  NavLinkProps & {
    allowedRoles?: string;
    authenticated?: boolean;
    text?: string;
    icon?: any;
  }
>) {
  return (
    <Nav.Link
      as={AuthNavLink}
      to={to}
      allowedRoles={allowedRoles}
      className={classNames(
        "qui-nav-link",
        typeof className === "string" ? className : undefined,
      )}
      end={end}
    >
      {Icon && <Icon className="me-3" style={{ marginTop: -2 }} />}
      {text}
      {children}
    </Nav.Link>
  );
}

function A(
  props: PropsWithChildren<
    NavLinkProps & { allowedRoles?: string; authenticated?: boolean }
  >,
) {
  const { className, ...rest } = props;
  return (
    <AuthNavLink
      {...rest}
      className={({ isActive }) =>
        (isActive ? "active" : "link-body-emphasis") + " " + className
      }
    />
  );
}
