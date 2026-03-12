import {
  type FunctionInvokeOptions,
  FunctionsHttpError,
} from "@supabase/supabase-js";
import { useSupabaseClient } from "../SupabaseContext";

export function useSupabaseFunction(
  fn: string,
  options: FunctionInvokeOptions = { method: "GET" },
) {
  const client = useSupabaseClient();
  return async () => {
    const { error } = await client.functions.invoke(fn, options);
    if (error && error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.text();
      console.log("Function returned an error", errorMessage);
      throw new Error("Es ist ein Fehler aufgetreten. " + errorMessage);
    }
  };
}
