import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Dropdown, Nav, NavItem } from "react-bootstrap";
import { BsGrid1X2 } from "react-icons/bs";
import { Outlet } from "react-router-dom";
import { TopNavbar } from "../navbar";
import { BrandSidebar, BrandSidebarLayout } from "./BrandSidebarLayout";
import { Sidebar } from "./Sidebar";
import { SidebarLayout } from "./SidebarLayout";
import { TopNavLayout } from "./TopNavLayout";
import { IoSettingsSharp } from "react-icons/io5";

export interface LayoutOptions {
  layout?: "topnav" | "topnav-fluid" | "sidebar" | "brand-sidebar";
  width?: number;
  sidebarClassName?: string;
  sidebarTheme?: string;
  topnavClassName?: string;
  topnavTheme?: string;
}

export function AppLayout({
  layout = "topnav",
  brand,
  topnav,
  sidenav,
  width = 280,
  children = <Outlet />,
  heightRelativeToParent,
  sidebarClassName = "bg-light border-end",
  sidebarTheme = "light",
  topnavClassName = "bg-light border-bottom",
  topnavTheme = "light",
}: PropsWithChildren<
  {
    brand?: ReactNode;
    topnav?: ReactNode;
    sidenav?: ReactNode;
    heightRelativeToParent?: boolean;
  } & LayoutOptions
>) {
  const [ops, setOps] = useState<LayoutOptions>({
    layout,
    width,
    sidebarClassName,
    sidebarTheme,
    topnavClassName,
    topnavTheme,
  });

  const setLayoutOptions = (o: LayoutOptions) => {
    setOps({
      width,
      sidebarClassName,
      sidebarTheme,
      topnavClassName,
      topnavTheme,
      ...o,
    });
  };

  let item = <div></div>;

  if (ops.layout === "topnav") {
    item = (
      <TopNavLayout
        heightRelativeToParent={heightRelativeToParent}
        top={
          <TopNavbar
            brand={brand}
            className={ops.topnavClassName}
            theme={ops.topnavTheme}
          >
            {topnav}
          </TopNavbar>
        }
      >
        {children}
      </TopNavLayout>
    );
  }

  if (ops.layout === "topnav-fluid") {
    item = (
      <TopNavLayout
        fluid
        heightRelativeToParent={heightRelativeToParent}
        top={
          <TopNavbar
            brand={brand}
            className={ops.topnavClassName}
            theme={ops.topnavTheme}
          >
            {topnav}
          </TopNavbar>
        }
      >
        {children}
      </TopNavLayout>
    );
  }

  if (ops.layout === "sidebar") {
    item = (
      <SidebarLayout
        heightRelativeToParent={heightRelativeToParent}
        top={
          <TopNavbar
            fluid
            brand={brand}
            className={ops.topnavClassName}
            theme={ops.topnavTheme}
          >
            {topnav}
          </TopNavbar>
        }
        sidebar={
          <Sidebar
            className={ops.sidebarClassName}
            theme={ops.sidebarTheme}
            width={ops.width}
          >
            {sidenav}
          </Sidebar>
        }
      >
        {children}
      </SidebarLayout>
    );
  }

  if (ops.layout === "brand-sidebar") {
    item = (
      <BrandSidebarLayout
        heightRelativeToParent={heightRelativeToParent}
        top={
          <TopNavbar
            fluid
            className={ops.topnavClassName}
            theme={ops.topnavTheme}
          >
            {topnav}
          </TopNavbar>
        }
        sidebar={
          <BrandSidebar
            className={ops.sidebarClassName}
            theme={ops.sidebarTheme}
            width={ops.width}
            brand={brand}
          >
            {sidenav}
          </BrandSidebar>
        }
      >
        {children}
      </BrandSidebarLayout>
    );
  }

  return (
    <LayoutOptionsContext.Provider
      value={{ layoutOptions: ops, setLayoutOptions }}
    >
      {item}
    </LayoutOptionsContext.Provider>
  );
}

interface LayoutOptionsContextType {
  layoutOptions: LayoutOptions;
  setLayoutOptions: (layoutOptions: LayoutOptions) => void;
}

export const LayoutOptionsContext = createContext<LayoutOptionsContextType>(
  {} as LayoutOptionsContextType
);

export function LayoutSwitcherDropdown({
  className = "ms-auto",
}: {
  className?: string;
}) {
  const ctx = useContext(LayoutOptionsContext);
  const { layoutOptions } = ctx || {};
  return (
    <Nav className={className}>
      <Dropdown
        as={NavItem}
        onSelect={(e) => {
          if (e === "sidebar") {
            ctx?.setLayoutOptions({ ...layoutOptions, layout: e as any });
          }
          if (e === "brand-sidebar") {
            ctx?.setLayoutOptions({ ...layoutOptions, layout: e as any });
          }
          if (e === "topnav") {
            ctx?.setLayoutOptions({ ...layoutOptions, layout: e as any });
          }
          if (e === "topnav-fluid") {
            ctx?.setLayoutOptions({ ...layoutOptions, layout: e as any });
          }

          if (e === "topnav-white") {
            ctx?.setLayoutOptions({
              ...layoutOptions,
              topnavClassName: "bg-white border-bottom shadow-sm",
              topnavTheme: "light",
            });
          }

          if (e === "topnav-light") {
            ctx?.setLayoutOptions({
              ...layoutOptions,
              topnavClassName: "bg-light border-bottom",
              topnavTheme: "light",
            });
          }

          if (e === "topnav-dark") {
            ctx?.setLayoutOptions({
              ...layoutOptions,
              topnavClassName: "bg-dark",
              topnavTheme: "dark",
            });
          }

          if (e === "topnav-custom") {
            ctx?.setLayoutOptions({
              ...layoutOptions,
              topnavClassName: "bg-purple",
              topnavTheme: "dark",
            });
          }

          if (e === "sidebar-white") {
            ctx?.setLayoutOptions({
              ...layoutOptions,
              sidebarClassName: "bg-white border-end",
              sidebarTheme: "light",
            });
          }

          if (e === "sidebar-light") {
            ctx?.setLayoutOptions({
              ...layoutOptions,
              sidebarClassName: "bg-light border-end",
              sidebarTheme: "light",
            });
          }

          if (e === "sidebar-dark") {
            ctx?.setLayoutOptions({
              ...layoutOptions,
              sidebarClassName: "bg-dark ",
              sidebarTheme: "dark",
            });
          }
          if (e === "sidebar-custom") {
            ctx?.setLayoutOptions({
              ...layoutOptions,
              sidebarClassName: "bg-purple ",
              sidebarTheme: "dark",
            });
          }
        }}
      >
        <Dropdown.Toggle size="sm" variant="light">
          <IoSettingsSharp color="#777" />
        </Dropdown.Toggle>
        <Dropdown.Menu align={"end"}>
          <Dropdown.Header>Layout</Dropdown.Header>
          <Dropdown.Item
            // active={ctx.layoutOptions.layout === "sidebar"}
            eventKey={"sidebar"}
          >
            Sidebar
          </Dropdown.Item>
          <Dropdown.Item
            //  active={ctx.layoutOptions.layout === "brand-sidebar"}
            eventKey={"brand-sidebar"}
          >
            Brand Sidebar
          </Dropdown.Item>
          <Dropdown.Item
            //  active={ctx.layoutOptions.layout === "topnav"}
            eventKey={"topnav"}
          >
            Top Navbar
          </Dropdown.Item>
          <Dropdown.Item
            //     active={ctx.layoutOptions.layout === "topnav-fluid"}
            eventKey={"topnav-fluid"}
          >
            Top Navbar / Full width
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Top Navbar</Dropdown.Header>
          <Dropdown.Item eventKey="topnav-white">White</Dropdown.Item>
          <Dropdown.Item eventKey="topnav-light">Light</Dropdown.Item>
          <Dropdown.Item eventKey="topnav-dark">Dark</Dropdown.Item>
          <Dropdown.Item eventKey="topnav-custom">Custom</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Header>Sidebar</Dropdown.Header>
          <Dropdown.Item eventKey="sidebar-white">White</Dropdown.Item>
          <Dropdown.Item eventKey="sidebar-light">Light</Dropdown.Item>
          <Dropdown.Item eventKey="sidebar-dark">Dark</Dropdown.Item>
          <Dropdown.Item eventKey="sidebar-custom">Custom</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
}
