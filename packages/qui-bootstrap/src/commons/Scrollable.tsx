import type { PropsWithChildren } from "react";

export function Scrollable({ children }: PropsWithChildren) {
  return (
    <div className="flex-fill d-flex flex-column" style={{ height: 1 }}>
      <div className="overflow-auto d-flex flex-column flex-fill">
        {children}
      </div>
    </div>
  );
}
