import { DependencyList, useEffect, useState } from "react";

/**
 * Interface representing the result of the useAsyncMemo hook.
 */
export interface AsyncMemoResult<T> {
  /** The data returned by the async function. */
  data?: T;
  /** The error returned by the async function, if any. */
  error?: Error;
  /** Boolean indicating if there was an error. */
  isError: boolean;
  /** Boolean indicating if the async function was successful. */
  isSuccess: boolean;
  /** Boolean indicating if the async function is still pending. */
  isPending: boolean;
  /** Function to reload the async function. */
  reload: (params?: any) => void;
  /** Function to manually set the data. */
  setData: (data: T | undefined) => void;
}

/**
 * Custom hook to handle asynchronous operations with memoization.
 * The result will be held as state.
 *
 * @param factory - The async function to be executed.
 * @param deps - Dependency list that will trigger the async function when changed.
 * @returns An object containing the state and control functions of the async operation.
 */
export function useAsyncMemo<T>(
  factory: (params?: any) => Promise<T> | undefined | null,
  deps: DependencyList
): AsyncMemoResult<T>;

/**
 * Custom hook to handle asynchronous operations with memoization.
 * The result will be held as state.
 *
 * @param factory - The async function to be executed.
 * @param deps - Dependency list that will trigger the async function when changed.
 * @param initial - Initial value for the data.
 * @returns An object containing the state and control functions of the async operation.
 */
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
