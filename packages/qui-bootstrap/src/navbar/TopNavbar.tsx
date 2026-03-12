import { Container, Navbar } from "react-bootstrap";

import classNames from "classnames";
import { PropsWithChildren, ReactNode } from "react";
import { useLayoutPrefs } from "../app/LayoutContext";

export function TopNavbar({
  theme,
  fluid,
  containerClassName,
  className = "bg-light",
  brand,
  children,
}: PropsWithChildren<{
  theme?: string;
  fluid?: boolean;
  containerClassName?: string;
  className?: string;
  brand?: ReactNode;
}>) {
  const layoutPrefs = useLayoutPrefs({
    fluid,
    insetsClassName: containerClassName,
    noInsets: undefined,
  });

  console.log("topnav.layoutPrefs", layoutPrefs);

  return (
    <Navbar expand="md" className={className} data-bs-theme={theme}>
      <Container
        className={classNames("", {
          [layoutPrefs.insetsClassName]: !layoutPrefs.noInsets,
        })}
        fluid={layoutPrefs.fluid}
      >
        {brand}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          {/* <Nav className="me-auto">
            <Nav.Link>Projects</Nav.Link>
            <Nav.Link active>Partners</Nav.Link>
          </Nav> */}

          {/* <Nav className="ms-auto">
            <Button variant="outline-primary" size="sm" className="ms-2">
              SignIn
            </Button>
          </Nav> */}
          {children}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
