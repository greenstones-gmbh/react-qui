import { DependencyList, useEffect, useState } from "react";

export interface AsyncMemoResult<T> {
  data?: T;
  error?: Error;
  isError: boolean;
  isSuccess: boolean;
  isPending: boolean;
  reload: (params?: any) => void;
  setData: (data: T | undefined) => void;
}

export function useAsyncMemo<T>(
  factory: (params?: any) => Promise<T> | undefined | null,
  deps: DependencyList
): AsyncMemoResult<T>;
export function useAsyncMemo<T>(
  factory: (params?: any) => Promise<T> | undefined | null,
  deps: DependencyList,
  initial: T
): AsyncMemoResult<T>;
export function useAsyncMemo<T>(
  factory: (params?: any) => Promise<T> | undefined | null,
  deps: DependencyList,
  initial?: T
): AsyncMemoResult<T> {
  const [val, setVal] = useState<T | undefined>(initial);
  const [error, setError] = useState<Error | undefined>();
  const [isPending, setPending] = useState<boolean>(true);

  const reload = (params?: any) => {
    let cancel = false;
    setError(undefined);
    setPending(true);

    const promise = factory(params);
    if (promise === undefined || promise === null) return;

    promise.then(
      (val) => {
        if (!cancel) {
          setVal(val);
        }
        setPending(false);
      },
      (reason) => {
        setError(reason);
        setVal(undefined);
        setPending(false);
      }
    );

    return () => {
      cancel = true;
    };
  };

  useEffect(() => {
    return reload();
  }, deps);
  return {
    data: val,
    error,
    isError: !!error,
    isSuccess: !!val,
    isPending,
    reload,
    setData: (v) => setVal(v),
  };
}
