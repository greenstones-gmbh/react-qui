import { Button, Nav, Navbar } from "react-bootstrap";

import { useAuth } from "@clickapp/qui-core";

export function NavbarAuthButtons({
  variant = "outline-primary",
}: {
  variant?: string;
}) {
  const { logout, login, isAuthenticated, userDisplayName } = useAuth();
  return (
    <>
      {!isAuthenticated && (
        <Nav className="ms-auto">
          <Button
            variant={variant}
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
            variant={variant}
            size="sm"
            className="ms-3"
            onClick={(e) => {
              logout();
            }}
          >
            Logout
          </Button>
        </Nav>
      )}
    </>
  );
}
