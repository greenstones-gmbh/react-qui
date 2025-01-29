import { SupabaseClient } from "@supabase/supabase-js";
import { PropsWithChildren } from "react";
import { SupabaseAuth, SupabaseAuthProps } from "./auth";
import { SupabaseContextProvider } from "./SupabaseContext";

export interface SupabaseProps {
  client: SupabaseClient;
  authProps?: SupabaseAuthProps;
}

export function Supabase(props: PropsWithChildren<SupabaseProps>) {
  return (
    <SupabaseContextProvider client={props.client}>
      <SupabaseAuth {...props.authProps}>{props.children}</SupabaseAuth>
    </SupabaseContextProvider>
  );
}
