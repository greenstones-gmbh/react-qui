import { useMemo } from "react";
import {
  type ListData,
  type ListOptions,
  type ListSource,
  type Sort,
  createPageMeta,
  createSinglePage,
  useList,
} from "./useList";

export type Filter<Type, TQuery = string> = (
  query?: TQuery,
) => (item: Type) => boolean;

export type Sorter<Type> = (sort: Sort) => (a: Type, b: Type) => number;

export interface ArraySourceOptions<Type, Query> {
  filter?: Filter<Type, Query>;
  sorter?: Sorter<Type>;
}

export function useArraySource<Type, Query>(
  array: Type[] | undefined,
  ops?: ArraySourceOptions<Type, Query>,
) {
  const dep = array && array.length > 0 ? array : "-";
  const source = useMemo<ListSource<Type, Query>>(
    () =>
      createArraySource(array, {
        filter: ops?.filter,
        sorter: ops?.sorter,
      }),
    [dep],
  );
  return source;
}

export function useArray<Type, Query = string, SortId = string>(
  array: Type[] | undefined,
  ops?: ArraySourceOptions<Type, Query> & ListOptions<Query>,
): ListData<Type, Query> {
  const source = useArraySource(array, ops);
  return useList(source, ops);
}

export function createArraySource<Type, Query>(
  items: Type[] | undefined,
  ops?: ArraySourceOptions<Type, Query>,
): ListSource<Type, Query> {
  //sconsole.log("ArraySource.createArraySource", items);
  return async (state) => {
    // console.log("ArraySource.run", state);

    const itemRows = items || [];

    const {
      paging,
      page = 0,
      pageSize = 10,
      sorting,
      filtering,
      query,
      sort,
    } = state;

    const filterItems = (itemss: Type[], query: Query | undefined) => {
      if (!query || !ops?.filter) return [...itemss];
      const f = ops.filter(query);
      return itemss.filter(f);
    };

    const filteredData = filtering
      ? filterItems(itemRows, query)
      : [...itemRows];

    const sortItems = (itemss: Type[], sort: Sort | undefined) => {
      if (!sort || !ops?.sorter) return [...itemss];
      const f = ops.sorter(sort);
      return [...itemss].sort(f);
    };

    const sortedData = sorting
      ? sortItems(filteredData, sort)
      : [...filteredData];

    const createPages = (data: Type[]) => {
      return paging ? createPage(data, page, pageSize) : createSinglePage(data);
    };

    return createPages(sortedData);
  };
}

export function createPage<Type>(
  items: Type[],
  page: number,
  pageSize: number,
) {
  const meta = createPageMeta(page, pageSize, items.length);
  const slice = items.slice(meta.range.start, meta.range.end);

  return {
    items: slice,
    meta,
  };
}

export const regExpFilter = (query?: string) => {
  if (!query) return (v: any) => true;
  try {
    const regex = new RegExp(query, "i");
    return (v: any) => {
      const s = JSON.stringify(v);
      return s.match(regex) !== null;
    };
  } catch (error) {
    //
  }
  return (v: any) => {
    return false;
  };
};

export function createObjectPropsContainsQuery<Type>(props: (keyof Type)[]) {
  return (query?: string) => {
    if (!query) return (v: any) => true;
    return (v: any) => {
      if (!props) {
        const s = JSON.stringify(v);
        return s.indexOf(query) !== -1;
      }
    };
  };
}

function contains(v: any, term: string): boolean {
  const s = JSON.stringify(v);
  return s.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1;
}

export function objectContains<Query = string>(
  queryProp?: keyof Query,
): Filter<any, Query> {
  return (query?: Query) => {
    if (!query) return (v: any) => true;
    return (v: any) => {
      const qv: any = queryProp ? query[queryProp] : query;
      if (qv == null || qv === "") return true;
      return contains(v, `${qv}`);
    };
  };
}

export function isEq<Type, Query>(
  prop: keyof Type,
  queryProp?: keyof Query,
): Filter<Type, Query> {
  return (query?: Query) => {
    if (!query) return (v: any) => true;
    return (v: Type) => {
      const vv: any = v[prop];
      const qv: any = queryProp ? query[queryProp] : query;
      if (qv == null || qv === "") return true;
      return vv === qv;
    };
  };
}

export function isSatisfiedBy<Type, Query>(
  fn: (value: Type, query?: Query) => boolean,
): Filter<Type, Query> {
  return (query?: Query) => {
    return (v: Type) => {
      return fn(v, query);
    };
  };
}

export function like<Type, Query>(
  prop: keyof Type,
  queryProp?: keyof Query,
): Filter<Type, Query> {
  return (query?: Query) => {
    if (!query) return (v: any) => true;
    return (v: any) => {
      const vv: any = v[prop];
      const qv: any = queryProp ? query[queryProp] : query;
      if (qv == null || qv === "") return true;
      return contains(vv, `${qv}`);
    };
  };
}

export function and<Type, Query>(
  ...filters: Filter<Type, Query>[]
): Filter<Type, Query> {
  return (query?: Query) => {
    if (!query) return (v: Type) => true;

    const parts = filters.map((f) => f.call(null, query));

    return (v: Type) => {
      const notValid = parts.find((p) => {
        const b = p.call(null, v);
        return !b;
      });

      return !notValid;
    };
  };
}

export function or<Type, Query>(
  ...filters: Filter<Type, Query>[]
): Filter<Type, Query> {
  return (query?: Query) => {
    if (!query) return (v: Type) => true;

    const parts = filters.map((f) => f.call(null, query));

    return (v: Type) => {
      const valid = parts.find((p) => {
        const b = p.call(null, v);
        return b;
      });

      return !!valid;
    };
  };
}

export const Filters = {
  and,
  or,
  like,
  isEq,
  objectContains,
  isSatisfiedBy,
};

function objectProps<Type>() {
  return (sort: Sort) => {
    return (a: Type, b: Type) => {
      const va = getByPath(a as any, sort.id);
      const vb = getByPath(b as any, sort.id);

      return (
        (`${va}` || "").localeCompare(`${vb}` || "") *
        (sort.direction === "asc" ? 1 : -1)
      );
    };
  };
}

export const Sorters = {
  objectProps,
};

function getByPath<T = unknown>(obj: any, path: string): T | undefined {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
