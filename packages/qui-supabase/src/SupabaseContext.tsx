import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, type PropsWithChildren, useContext } from "react";

export const CreateReactApp = {
  createSupabaseClient: () => {
    return createClient(
      process.env.REACT_APP_SUPABASE_URL!,
      process.env.REACT_APP_SUPABASE_SERVICE_ANON_KEY!,
    );
  },
};

export const ViteApp = {
  createSupabaseClient: () => {
    console.log(
      "create supabase client from vite env",
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_SERVICE_ANON_KEY,
    );

    return createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_SERVICE_ANON_KEY!,
    );
  },
};

const SupabaseContext = createContext<{ client: SupabaseClient }>({} as any);

export function SupabaseContextProvider({
  client,
  children,
}: PropsWithChildren<{ client: SupabaseClient }>) {
  return (
    <SupabaseContext.Provider value={{ client }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseClient(client?: SupabaseClient) {
  const { client: clientFromContext } = useContext(SupabaseContext);
  const supabaseClient = client || clientFromContext;
  if (!supabaseClient) {
    throw new Error("No Supabase Client defined.");
  }
  return supabaseClient;
}
