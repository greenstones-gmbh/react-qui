import { DependencyList } from "react";
import { useAsyncMemo } from "./useAsyncMemo";
import { log } from "console";

export const BASE_URL = "/msc-viewer";

export function useFetch<Result = any>(
  url: string,
  init?: RequestInit,
  deps: DependencyList = []
) {
  return useAsyncMemo<Result>(() => fetchJson(url, init), deps);
}

interface JsonFetchOptions extends RequestInit {
  skipToken?: boolean;
}

export async function fetchJson<Result = any>(
  url: string,
  ops?: JsonFetchOptions
): Promise<Result> {
  const token = sessionStorage.getItem("auth.access_token");

  const { headers, skipToken, ...others } = ops || {};

  const isProtected = !skipToken && token;
  const authHeaders = isProtected
    ? { Authorization: `Bearer ${token}` }
    : undefined;

  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
      ...headers,
    },
    ...others,
  });
  if (!res.ok) {
    if (res.status === 401 && isProtected) {
      sessionStorage.removeItem("auth.access_token");
      window.location.reload();
      return new Promise(() => {});
    }

    throw new Error(await res.text());
  }
  const json = await res.json();
  return json;
}
