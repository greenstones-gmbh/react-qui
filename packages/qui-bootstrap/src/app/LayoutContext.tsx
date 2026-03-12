import { createContext, useContext } from "react";

export interface LayoutPrefs {
  insetsClassName?: string;
  noInsets?: boolean;
  fluid?: boolean;
}

export const LayoutContext = createContext<LayoutPrefs>({});

export function useLayoutPrefs(prefs: LayoutPrefs) {
  const layoutPrefs = useContext(LayoutContext);

  //console.log("useLayoutPrefs", prefs, layoutPrefs);

  const noInsets = prefs.noInsets ?? layoutPrefs.noInsets ?? false;
  const insetsClassName =
    prefs.insetsClassName ?? layoutPrefs.insetsClassName ?? "mx-4";
  const fluid = prefs.fluid ?? layoutPrefs.fluid ?? false;

  return { fluid, insetsClassName, noInsets };
}
