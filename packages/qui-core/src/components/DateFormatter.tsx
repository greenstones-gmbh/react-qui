import { format, parseISO } from "date-fns";

export function DateFormatter({
  isoString,
  formatStr,
  type = "datetime",
}: {
  isoString?: string;
  formatStr?: string;
  type?: "date" | "time" | "datetime";
}) {
  if (!isoString) return null;

  const types: { [key: string]: string } = {
    date: "dd.MM.yyyy",
    time: "HH:mm",
    datetime: "dd.MM.yyyy HH:mm",
  };

  return <>{format(parseISO(isoString), formatStr || types[type])}</>;
}
