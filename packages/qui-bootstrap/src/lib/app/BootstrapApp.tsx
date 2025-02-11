import { AppRoutes, ModalContextProvider } from "@clickapp/qui-core";
import { PropsWithChildren, ReactNode } from "react";
import { SignInPage } from "../auth";
import { NavbarAuthButtons } from "../navbar";
import { AppLayout, LayoutOptions, LayoutSwitcherDropdown } from "./AppLayout";
import { NavbarBrand } from "./BrandSidebarLayout";

import "bootstrap/dist/css/bootstrap.min.css";
import { Nav } from "react-bootstrap";
import { I18nContextProvider } from "../labels/Labels";

export interface BootstrapAppProps {
  topnav?: ReactNode;
  sidenav?: ReactNode;
  icon?: any;
  projectName?: string;
  publicRoutes?: ReactNode;
  protectedRoutes?: ReactNode;
  layoutProps?: LayoutOptions;
  hideLayoutSwitcher?: boolean;
}

export function BootstrapApp(props: PropsWithChildren<BootstrapAppProps>) {
  return (
    <I18nContextProvider>
      <ModalContextProvider>
        <AppRoutes
          layout={
            <>
              <AppLayout
                {...props.layoutProps}
                topnav={
                  <>
                    {props.topnav}

                    <Nav className="ms-auto" />
                    {!props.hideLayoutSwitcher && (
                      <LayoutSwitcherDropdown className="me-1" />
                    )}
                    <NavbarAuthButtons className="ms-1" />
                  </>
                }
                sidenav={props.sidenav}
                brand={
                  <NavbarBrand
                    name={props.projectName}
                    icon={props.icon}
                    className="ms-0"
                  />
                }
              />
            </>
          }
          login={
            <SignInPage
              title={props.projectName}
              enableSignWithPassword={true}
            />
          }
          public={props.publicRoutes}
          protected={props.protectedRoutes}
        />
      </ModalContextProvider>
    </I18nContextProvider>
  );
}
