import { Button, Nav, Navbar } from "react-bootstrap";

import { useAuth } from "@greenstones/qui-core";

export function NavbarAuthButtons({
  variant = "outline-primary",
  className = "ms-auto",
}: {
  variant?: string;
  className?: string;
}) {
  const auth = useAuth();

  if (Object.keys(auth).length === 0) return null;
  const { logout, login, isAuthenticated, userDisplayName } = auth;
  return (
    <>
      {!isAuthenticated && (
        <Nav className={className}>
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
        <Navbar.Text className={className}>{userDisplayName}</Navbar.Text>
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
