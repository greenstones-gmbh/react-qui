import classNames from "classnames";
import type { PropsWithChildren, ReactNode } from "react";
import { BasePage, type BasePageOptions } from "./BasePage";
import { GenericErrorPage } from "./ErrorPage";
import { LoadingPage } from "./LoadingPage";

export interface PageOptions extends BasePageOptions {
  breadcrumb?: ReactNode;
  header?: ReactNode | string;
  headerLead?: ReactNode | string;
  subheader?: ReactNode;
  footer?: ReactNode;
  scrollBody?: boolean;
  fillBody?: boolean;
  loading?: boolean;
  error?: any;
}

/** 
  Page with header, subheader/toolbar, scrollable body, and footer.
  Fills parent container and scrolls if content overflows.
*/
export function Page({
  breadcrumb,
  header,
  headerLead,
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
  containerWidth,
  containerClassName,
}: PageOptions) {
  let h: ReactNode = undefined;

  if (loading) return <LoadingPage />;

  if (error) return <GenericErrorPage error={error} />;

  if (header) {
    if (typeof header === "string") {
      h = <PageHeader lead={headerLead}>{header}</PageHeader>;
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
      containerWidth={containerWidth}
      containerClassName={containerClassName}
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
  lead,
}: {
  addon?: ReactNode | undefined;
  lead?: ReactNode | string;
} & PropsWithChildren) {
  let l;

  const leadExists = !!lead;

  if (leadExists) {
    if (typeof lead === "string") {
      l = <div className="lead">{lead}</div>;
    } else {
      l = lead;
    }
  }

  return (
    <div className="mb-3">
      <div className="d-flex align-items-center gap-3">
        <div>
          <h1 className="mb-0">{children}</h1>
        </div>
        {addon}
      </div>
      {leadExists && <div className="mt-1">{l}</div>}
    </div>
  );
}
