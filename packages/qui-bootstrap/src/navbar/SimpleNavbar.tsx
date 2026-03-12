import { Button, Container, Nav, Navbar } from "react-bootstrap";

import { useAuth } from "@greenstones/qui-core";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export function SimpleNavbar({
  name = "Project",
  children,
}: PropsWithChildren<{ name?: string }>) {
  const { logout, login, isAuthenticated, userDisplayName } = useAuth();
  return (
    <>
      <Navbar expand="md" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">
            {name}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">{children}</Nav>

            {!isAuthenticated && (
              <Nav className="ms-auto">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="ms-2"
                  onClick={(e) => {
                    login();
                  }}
                >
                  SignIn
                </Button>
              </Nav>
            )}

            {isAuthenticated && (
              <Navbar.Text className="ms-auto">{userDisplayName}</Navbar.Text>
            )}
            {isAuthenticated && (
              <Nav>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="ms-2"
                  onClick={(e) => {
                    logout();
                  }}
                >
                  Logout
                </Button>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
