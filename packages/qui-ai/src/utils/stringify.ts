export function stringifyWithFormat(object: any) {
  return JSON.stringify(
    object,
    (_, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  );
}
