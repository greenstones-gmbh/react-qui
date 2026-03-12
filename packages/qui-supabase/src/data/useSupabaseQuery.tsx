import { useCallback } from "react";

import type {
  PostgrestFilterBuilder,
  PostgrestBuilder,
} from "@supabase/postgrest-js";
import { useAsyncMemo } from "@greenstones/qui-core";
import { SupabaseClient } from "@supabase/supabase-js";
import { useSupabaseClient } from "../SupabaseContext";

export interface QueryFn<Type, Query> {
  (supabaseClient: SupabaseClient, query?: Query): Promise<Type>;
}

export function useSupabaseQuery<Type = any, Query = any>(
  queryFn: (
    supabaseClient: SupabaseClient,
    query?: Query,
  ) => PostgrestFilterBuilder<any, any, any, any> | PostgrestBuilder<any, any>,
  query?: Query,
) {
  const supabaseClient = useSupabaseClient();
  const fn: QueryFn<Type, Query> = useCallback<QueryFn<Type, Query>>(
    async (c, query) => {
      const { data } = await queryFn(c, query).throwOnError();
      return data as Type;
    },
    [],
  );
  return useAsyncMemo<Type>(() => fn(supabaseClient, query), [query]);
}
