import {
  ListData,
  ListOptions,
  ListSource,
  ListState,
  createPageMeta,
  createSinglePage,
  useList,
} from "@greenstones/qui-core";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useMemo } from "react";
import { useSupabaseClient } from "../SupabaseContext";

export interface SupabaseSourceOptions<Query> {
  supabaseClient?: SupabaseClient;
  select?: string;
  filter?: (
    queryBuilder: PostgrestFilterBuilder<any, any, any>,
    query?: Query
  ) => void;
}

export function useSupabaseTable<Type, Query = string>(
  from: string,
  ops?: SupabaseSourceOptions<Query> & ListOptions<Query>
): ListData<Type, Query> {
  const { filter, filtering, ...rest } = ops || {};
  const modifiedOps = {
    ...rest,
    filtering: !!filter && filtering != false,
  } as SupabaseSourceOptions<Query> & ListOptions<Query>;

  const source = useSupabaseSource<Type, Query>(from, ops);
  const listData = useList(source, modifiedOps);
  return listData;
}

export function useSupabaseSource<Type, Query>(
  from: string,
  ops?: SupabaseSourceOptions<Query>
) {
  const supabaseClient = useSupabaseClient(ops?.supabaseClient);

  const source = useMemo<ListSource<Type, Query>>(
    () => createSupabaseSource<Type, Query>(supabaseClient, from, ops),
    [supabaseClient, from, ops?.select]
  );
  return source;
}

export function createSupabaseSource<Type, Query>(
  supabaseClient: SupabaseClient,
  from: string,
  ops?: SupabaseSourceOptions<Query>
): ListSource<Type, Query> {
  return async (state) => {
    const {
      paging,
      page = 0,
      pageSize = 10,
      sorting,
      filtering,
      query,
      sort,
    } = state;

    const builder = supabaseClient.from(from);

    const qbuilder = builder.select(ops?.select || "*", { count: "exact" });

    if (filtering && ops?.filter && query) {
      ops?.filter.call(null, qbuilder, query);
    }

    if (paging) {
      qbuilder.range(page * pageSize, (page + 1) * pageSize - 1);
    }

    qbuilder.returns<Type>();

    if (sorting && sort) {
      qbuilder.order(`${sort.id}`, {
        ascending: sort.direction === "asc",
      });
    }

    const { data, count } = await qbuilder;

    const d = data as Type[];

    const createPages = (data: Type[]) => {
      return paging
        ? {
            items: data,
            meta: createPageMeta(page, pageSize, count || data.length),
          }
        : createSinglePage(data);
    };

    return createPages(d);
  };
}

export function useSupabaseTableQuery<Type, Query>(
  table: string,
  ops?: SupabaseSourceOptions<Query> & ListOptions<Query>
) {
  const supabaseClient = useSupabaseClient(ops?.supabaseClient);
  const source: ListSource<Type, Query> = useCallback(
    async (listState?: ListState<Query>) => {
      const {
        paging,
        page = 0,
        pageSize = 10,
        sorting,
        filtering,
        query,
        sort,
      } = listState || {};

      const queryBuilder = supabaseClient
        .from(table)
        .select(ops?.select || "*", { count: "exact" });

      if (filtering && ops?.filter) {
        ops?.filter.call(null, queryBuilder, query);
      }

      if (paging) {
        queryBuilder.range(page * pageSize, (page + 1) * pageSize - 1);
      }

      if (sorting && sort) {
        queryBuilder.order(`${sort.id}`, {
          ascending: sort.direction === "asc",
        });
      }

      const { data, count } = await queryBuilder.throwOnError();

      const createPages = (data: Type[]) => {
        return paging
          ? {
              items: data,
              meta: createPageMeta(page, pageSize, count || data.length),
            }
          : createSinglePage(data);
      };

      return createPages(data as Type[]);
    },
    []
  );

  return useList(source, ops);
}
