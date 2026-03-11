import { useAsyncMemo } from "./useAsyncMemo";

export interface ResourceSource<Type, Query> {
  (query: Query): Promise<Type>;
}

export function useOne<Type, Query>(
  source: ResourceSource<Type, Query>,
  query: Query
): { data?: Type; error?: Error } {
  return useAsyncMemo<Type>(() => source(query), [source, query]);
}
