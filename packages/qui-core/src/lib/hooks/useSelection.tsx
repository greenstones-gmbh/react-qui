import { DependencyList, useEffect } from "react";
import { useState } from "react";

// export const useSelection = (
//   rowAction,
//   deps,
//   singleMode = true,
//   initialSelection = []
// ) => {
//   const [selection, setSelection] = useState(initialSelection);

//   useEffect(() => {
//     setSelection(initialSelection);
//   }, deps);

//   const add = (v) => {
//     setSelection([...selection, v]);
//   };

//   const onRowClick = (v, e) => {
//     if (selection === v) {
//       if (e.detail > 1) {
//         rowAction(v);
//       } else {
//       }
//     } else {
//       singleMode ? setSelection(v) : add(v);
//     }
//   };

//   return { selection, setSelection, onRowClick };
// };

export interface Selection<Type> {
  selectedItems: Type[];
  setSelectedItems: (items: Type[] | undefined) => void;
  onItemClick: (item: Type, e: any) => void;
  isSelected: (item: Type) => boolean;
}

export function useSelection<Type>(
  singleMode: boolean = true,
  rowAction?: (v: Type) => void,
  deps?: DependencyList
): Selection<Type> {
  const [selection, setSelection] = useState<Type[]>([]);

  useEffect(() => {
    setSelection([]);
  }, deps ?? ["-"]);

  const isSelected = (v: Type) => {
    return selection.indexOf(v) !== -1;
  };

  const toggleSelection = (e: any, v: Type) => {
    if (e.ctrlKey || e.metaKey) {
      if (!isSelected(v)) {
        setSelection(singleMode ? [v] : [...selection, v]);
      } else {
        setSelection(selection.filter((r) => r !== v));
      }
    } else {
      setSelection([v]);
    }
  };

  const onItemClick = (v: Type, e: any) => {
    if (isSelected(v)) {
      if (e.detail > 1) {
        rowAction?.(v);
      } else {
        toggleSelection(e, v);
      }
    } else {
      toggleSelection(e, v);
    }
  };

  return {
    selectedItems: selection,
    setSelectedItems: (items) => setSelection(items || []),
    onItemClick,
    isSelected,
  };
}

// export function useSingleSelection<Type>(
//   deps = [],
//   initialSelection = undefined
// ): Selection<Type> {
//   const [selection, setSelection] = useState<Type | undefined>(
//     initialSelection
//   );

//   const toggleSelection = (v: Type) => {
//     if (selection !== v) {
//       setSelection(v);
//     } else {
//       setSelection(undefined);
//     }
//   };
//   const isSelected = (disp: Type) => disp === selection;
//   useEffect(() => {
//     setSelection(initialSelection);
//   }, deps);

//   return { selection, setSelection, isSelected, toggleSelection };
// }
