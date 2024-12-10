import classNames from "classnames";
import { PropsWithChildren } from "react";
import { Container } from "react-bootstrap";
import { useLayoutPrefs } from "../app/LayoutContext";

export function BasePage({
  fluid,
  className,
  insets,
  noInsets,
  children,
}: PropsWithChildren<{
  fluid?: boolean;
  className?: string;
  insets?: string;
  noInsets?: boolean;
}>) {
  const layoutPrefs = useLayoutPrefs({
    fluid,
    noInsets,
    insetsClassName: insets,
  });

  return (
    <div
      className={classNames("d-flex flex-fill flex-column", className, {
        [layoutPrefs.insetsClassName]: !layoutPrefs.noInsets,
      })}
    >
      <Container
        fluid={layoutPrefs.fluid}
        className={classNames("d-flex flex-fill flex-column mt-4 pb-1")}
        style={{ minHeight: 0 }}
      >
        {children}
      </Container>
    </div>
  );
}
