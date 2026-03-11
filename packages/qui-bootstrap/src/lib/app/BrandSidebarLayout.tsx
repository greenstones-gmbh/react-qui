import classNames from "classnames";
import {
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from "react";
import { Container, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { Sidebar } from "./Sidebar";

export function BrandSidebarLayout({
  top,
  sidebar,
  children = <Outlet />,
  heightRelativeToParent,
  fluidContent = true,
  contentInsetsClassName = "px-4",
}: PropsWithChildren<{
  top?: ReactElement;
  sidebar: ReactElement;
  heightRelativeToParent?: boolean;
  fluidContent?: boolean;
  contentInsetsClassName?: string;
}>) {
  return (
    <LayoutContext.Provider
      value={{ fluid: fluidContent, insetsClassName: contentInsetsClassName }}
    >
      <div
        className={classNames(
          "d-flex flex-row  flex-fill",
          heightRelativeToParent ? "h-100" : "vh-100",
        )}
      >
        {sidebar}

        <div className="d-flex flex-column flex-fill" style={{ minHeight: 0 }}>
          <LayoutContext.Provider
            value={{
              fluid: true,
              insetsClassName: contentInsetsClassName,
            }}
          >
            {top && <div className="flex-shrink-0">{top}</div>}
          </LayoutContext.Provider>
          <div
            className="d-flex flex-row flex-fill flex-shrink-1"
            style={{ minHeight: 0 }}
          >
            {children}
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}

export function BrandSidebar({
  className,
  theme,
  width = 280,
  children,
  brand,
  navbarClassName,
  navbarTheme,
}: PropsWithChildren<{
  className?: string;
  theme?: string;
  width?: number;
  brand?: ReactNode;
  navbarClassName?: string;
  navbarTheme?: string;
}>) {
  return (
    <Sidebar
      className={className}
      theme={theme}
      width={width}
      wrapChildreinInContainer={false}
    >
      <Navbar className={navbarClassName} data-bs-theme={navbarTheme || theme}>
        <Container className="">{brand}</Container>
      </Navbar>
      <Container>{children}</Container>
    </Sidebar>
  );
}

export function NavbarBrand({
  children,
  name = "Project",
  icon: IconName,
  iconClassName = "me-3",
  className,
}: PropsWithChildren<{
  name?: string;
  icon?: any;
  iconClassName?: string;
  className?: string;
}>) {
  return (
    <Navbar.Brand
      as={Link}
      to="/"
      className={classNames("mx-2 fw-semibold", className)}
    >
      {IconName && <IconName size={28} className={iconClassName} />}
      {name}
      {children}
    </Navbar.Brand>
  );
}
