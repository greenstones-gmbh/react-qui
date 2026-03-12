import {
  AuthContext,
  type BaseAuthProps,
  useRoles,
} from "@greenstones/qui-core";
import { type Provider, SupabaseClient } from "@supabase/supabase-js";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "../SupabaseContext";

export interface SupabaseAuthProps extends BaseAuthProps {
  supabaseClient?: SupabaseClient;
  loginPath?: string;
}

export function SupabaseAuth({
  supabaseClient: supabaseClientFromProps,
  children,
  loginPath = "/login",
  afterLoginPath,
  afterLogoutPath,
  roleMapper,
}: PropsWithChildren<SupabaseAuthProps>) {
  const supabaseClient = useSupabaseClient(supabaseClientFromProps);

  const [user, setUser] = useState<any>(undefined);
  const [isLoading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const f = async () => {
      const { data, error } = await supabaseClient.auth.getUser();

      if (!error) setUser(data);
      else setUser(undefined);

      setLoading(false);
    };
    f();
  }, []);

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        console.log("onAuthStateChange", event, session);

        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          if (event === "SIGNED_IN") {
            setUser({ user: session?.user, session: session });
          } else if (event === "SIGNED_OUT") {
            setUser(undefined);
            navigate(afterLogoutPath ?? "/");
          }
        }
      },
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  const { hasRole } = useRoles(user?.user, roleMapper);

  if (isLoading) {
    return null;
  }

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  const login = async (returnTo?: string) => {
    navigate(loginPath, {
      state: {
        redirectTo: returnTo ?? afterLoginPath,
      },
    });
  };

  const logout = async (returnTo?: string) => {
    await supabaseClient.auth.signOut();
    setUser(undefined);
    navigate(returnTo ?? afterLogoutPath ?? "/");
  };

  const loginWithPassword = async (
    username: string,
    password: string,
    returnTo?: string,
  ) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: username,
      password,
    });

    if (error) throw error;

    setUser(data);
    navigate(returnTo ?? afterLoginPath ?? "/");
  };

  const loginWithOAuth = async (provider: string, returnTo?: string) => {
    await supabaseClient.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${window.location.origin}${returnTo ?? afterLoginPath}`,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user: user,
        userDisplayName: user?.user.email,
        token: user?.session?.access_token,
        login,
        logout,
        loginWithPassword,
        loginWithOAuth,

        afterLoginPath,
        afterLogoutPath,

        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function tableRoleMapper(
  supabaseClient: SupabaseClient,
  table: string,
  roleColumn: string = "role",
) {
  return async (user: any) => {
    const { data } = await supabaseClient
      .from(table)
      .select(roleColumn)
      .eq("user_id", user.id)
      .throwOnError();
    const roles = data?.map((r: any) => r[roleColumn]) ?? [];
    console.log("roles", roles);
    return roles;
  };
}

export function hasOneOfRoles(hasRole: any, roles: string[]) {
  return !!roles.find((r) => hasRole(r));
}
