import classNames from "classnames";
import { CSSProperties, PropsWithChildren } from "react";
import { Container } from "react-bootstrap";

import "./Sidebar.css";

export function Sidebar({
  className,
  theme,
  width = 280,
  children,
  styles = {},
  wrapChildreinInContainer = true,
}: PropsWithChildren<{
  className?: string;
  styles?: CSSProperties;
  theme?: string;
  width?: number;
  wrapChildreinInContainer?: boolean;
}>) {
  return (
    <div
      className={classNames("ca-sidebar flex-shrink-0", className)}
      data-bs-theme={theme}
      style={{
        ...styles,
        ...(width ? { width: width } : {}),
      }}
    >
      {wrapChildreinInContainer ? (
        <Container fluid>{children}</Container>
      ) : (
        children
      )}
    </div>
  );
}
