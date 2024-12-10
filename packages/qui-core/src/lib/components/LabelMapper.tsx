import { ReactNode } from "react";

export function LabelMapper<Value extends string | number>({
  value,
  mapper,
  values,
}: {
  value: Value;
  mapper?: (v: Value) => ReactNode;
  values?: { [key in Value]: ReactNode };
}) {
  if (mapper) return <>{mapper(value)}</>;
  if (values) return <>{values[value] || value}</>;

  return <>{value}</>;
}
