import classNames from "classnames";
import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";

export function TopNavLayout({
  top,
  children = <Outlet />,
  heightRelativeToParent,
  fluid = false,
}: PropsWithChildren<{
  top: JSX.Element;
  heightRelativeToParent?: boolean;
  fluid?: boolean;
}>) {
  return (
    <LayoutContext.Provider value={{ fluid: fluid ?? false, noInsets: true }}>
      <div
        className={classNames(
          "d-flex flex-column  flex-fill",
          heightRelativeToParent ? "h-100" : "vh-100"
        )}
      >
        <div className="flex-shrink-0">{top}</div>
        <div
          className="d-flex flex-row flex-fill flex-shrink-1"
          style={{ minHeight: 0 }}
        >
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
