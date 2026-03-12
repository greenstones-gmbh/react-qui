import classNames from "classnames";
import type { PropsWithChildren, ReactNode } from "react";
import { BasePage } from "./BasePage";
import { GenericErrorPage } from "./ErrorPage";
import { LoadingPage } from "./LoadingPage";

/** 
  Page with header, subheader/toolbar, scrollable body, and footer.
  Fills parent container and scrolls if content overflows.
*/
export function Page({
  breadcrumb,
  header,
  subheader,
  footer,
  scrollBody = true,
  fillBody = true,
  fluid,
  className,
  insets,
  noInsets,
  children,
  loading,
  error,
}: PropsWithChildren<{
  breadcrumb?: ReactNode;
  header?: ReactNode | string;
  subheader?: ReactNode;
  footer?: ReactNode;
  scrollBody?: boolean;
  fillBody?: boolean;
  fluid?: boolean;
  className?: string;
  insets?: string;
  noInsets?: boolean;
  loading?: boolean;
  error?: any;
}>) {
  let h = undefined;

  if (loading) return <LoadingPage />;

  if (error) return <GenericErrorPage error={error} />;

  if (header) {
    if (typeof header === "string") {
      h = <PageHeader>{header}</PageHeader>;
    } else {
      h = header;
    }
  }

  return (
    <BasePage
      className={className}
      fluid={fluid}
      insets={insets}
      noInsets={noInsets}
    >
      {breadcrumb}
      {h}
      {subheader}
      <div
        className={classNames("my-2 d-flex flex-column", {
          "overflow-auto": scrollBody,
          "flex-fill": fillBody,
        })}
      >
        {children}
      </div>
      {footer}
    </BasePage>
  );
}

export function PageHeader({
  children,
  addon,
}: { addon?: ReactNode | undefined } & PropsWithChildren) {
  return (
    <div className="d-flex align-items-center mb-3 gap-3">
      <div>
        <h1 className="mb-0">{children}</h1>
      </div>
      {addon}
    </div>
  );
}
