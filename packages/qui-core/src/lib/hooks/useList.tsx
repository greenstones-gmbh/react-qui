import { useMemo, useState } from "react";
import { AsyncMemoResult, useAsyncMemo } from "./useAsyncMemo";

export interface Sort {
  id: string;
  direction: "asc" | "desc";
}

export interface ListState<Query> {
  paging: boolean;
  sorting: boolean;
  filtering: boolean;

  page?: number;
  pageSize?: number;
  sort?: Sort;
  query?: Query;
}

interface ListStateHeplers<Query> {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSort: (sort: Sort | undefined) => void;
  //   isSortIdActive: (id: string) => boolean;
  //   isSortIdActiveAndAsc: (id: string) => boolean;
  //   setSortId: (id: string) => void;
  setQuery: (query: Query | undefined) => void;
}

export interface PageMeta {
  page: number;
  range: { start: number; end: number };
  totalItems: number;
  totalPages: number;
}

export interface ListSource<Type, Query> {
  (state: ListState<Query>): Promise<{
    items: Type[];
    meta: PageMeta;
  }>;
}

export interface ListPagerPage {
  page: number;
  label: string;
  select: () => void;
  active: boolean;
}

export interface ListPaging {
  hasPrev: boolean;
  hasNext: boolean;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  isFirst: boolean;
  isLast: boolean;
  pageString: string;
  page: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  pageSize: number;
  totalPages: number;
  pages: (pagerSize?: number) => ListPagerPage[];
  rangeString: string;
  totalItems: number;
}

interface Binding {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

export interface ListQuery<Query> {
  value?: Query;
  setValue: (query: Query | undefined) => void;
  field: (f: keyof Query) => Binding;
  setField: (f: keyof Query, v: any) => void;
  bind: () => Binding;
}

export interface ListSorting {
  value?: Sort;
  setValue: (sort: Sort | undefined) => void;
  sortById: (id: string) => void;
  isActive: (id: string) => boolean;
  isActiveAndAsc: (id: string) => boolean;
  isActiveAndDesc: (id: string) => boolean;
}

export interface ListData<Type, Query> {
  items?: Type[];
  totalItems?: number;
  paging?: ListPaging;
  query?: ListQuery<Query>;
  sorting?: ListSorting;

  sourceData: AsyncMemoResult<{
    items: Type[];
    meta: PageMeta;
  }>;
}

function useListState<Query>(ops?: {
  paging?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  initialPage?: number;
  initialPageSize?: number;
  initialQuery?: Query;
  initialSort?: Sort;
}): {
  state: ListState<Query>;
  helpers: ListStateHeplers<Query>;
} {
  const {
    paging = true,
    sorting = true,
    filtering = true,
    initialPage = 0,
    initialPageSize = 20,
    initialQuery,
    initialSort,
  } = ops ?? {};

  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, _setPageSize] = useState<number>(initialPageSize);

  const [query, _setQuery] = useState<Query | undefined>(initialQuery);
  const [sort, _setSort] = useState<Sort | undefined>(initialSort);

  const setPageSize = (ps: number) => {
    _setPageSize(ps);
    setPage(initialPage);
  };

  const setQuery = (q: Query | undefined) => {
    _setQuery(q);
    setPage(0);
  };

  const setSort = (sort: Sort | undefined) => {
    _setSort(sort);
    setPage(0);
  };

  const state = useMemo(
    () => ({
      paging,
      sorting,
      filtering,
      page,
      pageSize,
      query,
      sort,
    }),
    [paging, sorting, filtering, page, pageSize, query, sort]
  );

  //   const isSortIdActive = (id: SortId) => !!sort && sort.id === id;
  //   const isSortIdActiveAndAsc = (id: SortId) =>
  //     isSortIdActive(id) && sort?.direction === "asc";
  //   const setSortId = (id: SortId) => {
  //     const d =
  //       id === sort?.id ? (sort.direction !== "asc" ? "asc" : "desc") : "asc";
  //     setSort({ id, direction: d });
  //   };

  const helpers = {
    setPage,
    setPageSize,

    setSort,
    // isSortIdActive,
    // isSortIdActiveAndAsc,
    // setSortId,

    setQuery,
  };

  return { state, helpers };
}

export interface ListOptions<Query> {
  paging?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  initialPage?: number;
  initialPageSize?: number;
  initialQuery?: Query;
  initialSort?: Sort;
}

export function useList<Type, Query>(
  source: ListSource<Type, Query>,
  ops?: ListOptions<Query>
): ListData<Type, Query> {
  const { state, helpers } = useListState(ops);

  const sourceData = useAsyncMemo(() => {
    return source(state);
  }, [source, state]);

  const { data } = sourceData;

  // filtering
  const { query, filtering, sorting, sort } = state;
  const { setQuery, setSort } = helpers;

  const listQuery = useMemo<ListQuery<Query> | undefined>(() => {
    if (!filtering) return undefined;
    const q: ListQuery<Query> = {
      value: query,
      setValue: setQuery,

      setField: (f, v) => {
        setQuery({
          ...query,
          [f]: v,
        } as Query);
      },

      field: (f): Binding => {
        return {
          value: `${query?.[f] ?? ""}`,
          checked: !!query?.[f],
          onChange: (e: any) => {
            setQuery({
              ...query,
              [f]:
                e.target.type === "checkbox"
                  ? e.target.checked
                  : e.target.value,
            } as Query);
          },
        };
      },

      bind: (): Binding => {
        return {
          value: `${query ?? ""}`,
          checked: !!query,
          onChange: (e: any) => {
            setQuery(
              e.target.type === "checkbox"
                ? e.target.checked
                : (e.target.value as Query)
            );
          },
        };
      },
    };

    return q;
  }, [query, setQuery, filtering]);

  //sorting
  const listSorting = useMemo<ListSorting | undefined>(() => {
    if (sorting) {
      const sortById = (id: string) => {
        const d =
          id === sort?.id ? (sort.direction !== "asc" ? "asc" : "desc") : "asc";
        setSort({ id, direction: d });
      };

      const isActive = (id: string) => !!sort && sort.id === id;
      const isActiveAndAsc = (id: string) =>
        isActive(id) && sort?.direction === "asc";

      const isActiveAndDesc = (id: string) =>
        isActive(id) && sort?.direction === "desc";

      return {
        value: sort,
        setValue: setSort,
        sortById,
        isActive,
        isActiveAndAsc,
        isActiveAndDesc,
      };
    }
    return undefined;
  }, [sorting, sort, setSort]);

  // paging
  const paging = useMemo<ListPaging | undefined>(() => {
    const { pageSize, paging } = state;

    if (data && paging) {
      const { setPage, setPageSize } = helpers;

      const { totalPages, page, range, totalItems } = data.meta;

      const hasPrev = page > 0;
      const hasNext = page < totalPages - 1;
      const next = () => hasNext && setPage?.(page + 1);
      const prev = () => hasPrev && setPage?.(page - 1);
      const first = () => setPage?.(0);
      const last = () => setPage?.(totalPages - 1);
      const isFirst = page === 0;
      const isLast = page === totalPages - 1;
      const pageString = `${page + 1}`;
      const rangeString = `${range.start + 1}-${range.end}`;

      const pages = (paginatorSize: number = 5) => {
        var newSize = Math.min(paginatorSize, totalPages);
        const paginationLeftSide = Math.floor(newSize / 2);
        var paginatorFirstPage = Math.max(0, page - paginationLeftSide);

        if (paginatorFirstPage + newSize > totalPages)
          paginatorFirstPage = totalPages - newSize;

        const pages = [...Array.from(Array(newSize).keys())]
          .map((p) => p + paginatorFirstPage)
          .map((p) => ({
            page: p,
            label: `${p + 1}`,
            select: () => setPage?.(p),
            active: p === page,
          }));
        return pages;
      };

      return {
        hasPrev,
        hasNext,
        next,
        prev,
        first,
        last,
        isFirst,
        isLast,
        pageString,
        page,
        setPage,
        setPageSize,
        pageSize,
        totalPages,
        pages,
        rangeString,
        totalItems,
      } as ListPaging;
    }

    return undefined;
  }, [data, state]);

  return {
    items: data?.items,
    paging,
    query: listQuery,
    sorting: listSorting,
    totalItems: paging ? paging.totalItems : data?.items.length,
    sourceData,
  };
}

export function createSinglePage<Type>(items: Type[]) {
  const totalItems = items.length;
  return {
    items,
    meta: {
      page: 0,
      range: { start: 0, end: items.length - 1 },
      totalItems,
      totalPages: 1,
    },
  };
}

// export function createPage<Type>(items: Type[], meta: PageMeta) {
//   return {
//     items: items,
//     meta,
//   };
// }

// export function createPage<Type>(
//   items: Type[],
//   pmetaage: number,
//   pageSize: number,
//   totalItems: number
// ) {
//   return {
//     items: items,
//     meta: createPageMeta(page, pageSize, totalItems),
//   };
// }

export function createPageMeta(
  page: number,
  pageSize: number,
  totalItems: number
): PageMeta {
  const start = pageSize * page;
  const end = Math.min(pageSize * page + pageSize, totalItems);
  const totalPages =
    Math.floor(totalItems / pageSize) + (totalItems % pageSize > 0 ? 1 : 0);

  return {
    page,
    range: { start, end },
    totalItems,
    totalPages,
  };
}
