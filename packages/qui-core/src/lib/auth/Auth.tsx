import { createContext, useContext, useEffect } from "react";
import {
  type NavLinkProps,
  NavLink as RouterNavLink,
  useLocation,
} from "react-router-dom";
import { useAsyncMemo } from "../hooks/useAsyncMemo";

export interface BaseAuthProps {
  afterLoginPath?: string;
  afterLogoutPath?: string;
  roleMapper?: (user: any) => Promise<string[]>;
}

export interface IAuthContext {
  user?: any;
  userDisplayName?: string;
  isAuthenticated: boolean;
  logout(returnTo?: string): Promise<void>;
  login(returnTo?: string): Promise<void>;
  token?: string;

  loginWithPassword?(
    username: string,
    password: string,
    returnTo?: string,
  ): Promise<void>;
  loginWithOAuth?(provider: string, returnTo?: string): Promise<void>;

  afterLoginPath?: string;
  afterLogoutPath?: string;

  hasRole(role: string): boolean;
  roles?: string[];
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function useAuth(): IAuthContext {
  return useContext(AuthContext);
}

export const Guard = ({
  children,
  redirectToLogin = true,
  role,
}: {
  role?: string;
  redirectToLogin?: boolean;
  children?: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  const { isAuthenticated, login, hasRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && redirectToLogin) {
      login(pathname);
    }
  }, [isAuthenticated, login, redirectToLogin, pathname]);

  if (!isAuthenticated) return <>protected</>;

  if (role && !hasRole(role)) return <>access denided</>;

  return <>{children}</>;
};

export function NavLink({
  allowedRoles,
  authenticated,
  ...props
}: NavLinkProps & { allowedRoles?: string; authenticated?: boolean }) {
  const { hasRole, isAuthenticated } = useAuth();
  if (authenticated && !isAuthenticated) return null;
  if (allowedRoles && !hasRole(allowedRoles)) return null;
  return <RouterNavLink {...props} />;
}

export function useRoles(
  user: any,
  roleMapper?: (user: any) => Promise<string[]>,
) {
  const { data: roles } = useAsyncMemo(async () => {
    if (!user || !roleMapper) {
      return [];
    }
    return await roleMapper(user);
  }, [user, roleMapper]);

  return {
    roles,
    hasRole(role: string) {
      return !!user && roles?.indexOf(role) !== -1;
    },
  };
}

export const testRoleMapper = (roles: string[]) => async (user: any) => roles;
