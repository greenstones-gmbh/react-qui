import classNames from "classnames";
import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";

export function SidebarLayout({
  top,
  sidebar,
  children = <Outlet />,
  fluidContent = true,
  heightRelativeToParent,
  contentInsetsClassName = "px-4",
}: PropsWithChildren<{
  top?: JSX.Element;
  sidebar: JSX.Element;
  heightRelativeToParent?: boolean;
  fluidContent?: boolean;
  contentInsetsClassName?: string;
}>) {
  return (
    <div
      className={classNames(
        "d-flex flex-row flex-fill",
        heightRelativeToParent ? "h-100" : "vh-100"
      )}
    >
      <div className="d-flex flex-column flex-fill ">
        <LayoutContext.Provider
          value={{ fluid: true, insetsClassName: "mx-2" }}
        >
          {top && <div className="flex-shrink-0">{top}</div>}
        </LayoutContext.Provider>
        <LayoutContext.Provider
          value={{
            fluid: fluidContent,
            insetsClassName: contentInsetsClassName,
          }}
        >
          <div
            className="d-flex flex-row flex-fill flex-shrink-1"
            style={{ minHeight: 0 }}
          >
            {sidebar}
            {children}
          </div>
        </LayoutContext.Provider>
      </div>
    </div>
  );
}
