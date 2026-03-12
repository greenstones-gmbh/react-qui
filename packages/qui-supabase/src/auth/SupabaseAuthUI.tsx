import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@greenstones/qui-core";

export const SupabaseAuthUI = ({
  supabaseClient,
  providers = ["azure", "bitbucket"],
}: any) => {
  const { isAuthenticated, afterLoginPath } = useAuth();
  const { state } = useLocation();
  const { redirectTo } = state || {};

  if (isAuthenticated) {
    return <Navigate to={redirectTo || afterLoginPath || "/"} />;
  }
  return (
    <Auth
      supabaseClient={supabaseClient}
      appearance={{ theme: ThemeSupa }}
      providers={providers}
      redirectTo={`${window.location.origin}${
        redirectTo || afterLoginPath || "/"
      }`}
      providerScopes={{ azure: "email" }}
    />
  );
};
