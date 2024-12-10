import { PropsWithChildren, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, BaseAuthProps, useRoles } from "./Auth";

export interface SimpleAuthProps extends BaseAuthProps {
  loginPath: string;
}

export function SimpleAuth({
  children,
  loginPath = "/login",
  afterLoginPath = "/",
  afterLogoutPath,
  roleMapper,
}: PropsWithChildren<SimpleAuthProps>) {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(undefined);
  const { hasRole } = useRoles(user, roleMapper);

  const login = async (returnTo?: string) => {
    navigate(loginPath, {
      state: {
        redirectTo: returnTo ?? afterLoginPath,
      },
    });
  };

  const logout = async (returnTo?: string) => {
    setUser(undefined);
    navigate(returnTo ?? afterLogoutPath ?? "/");
  };

  const loginWithPassword = async (
    username: string,
    password: string,
    returnTo?: string
  ) => {
    const u = createUser(username);
    setUser(u);
    navigate(returnTo ?? afterLoginPath ?? "/");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user: user,
        userDisplayName: user?.displayName,
        token: user?.access_token,
        login,
        logout,
        loginWithPassword,

        afterLoginPath,
        afterLogoutPath,

        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function createUser(username: string) {
  return {
    displayName: username,
  };
}
