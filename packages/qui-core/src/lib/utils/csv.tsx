import { format } from "date-fns";
import FileSaver from "file-saver";
import { Column } from "../fields/Columns";
import { renderToString } from "react-dom/server";

export function convertToCsv<Type>(columns: Column<Type>[], data: Type[]) {
  console.log("convertToCsv", columns);
  const separator = ";";
  const lines = [];
  const header = columns
    .map((c: Column<Type>) => sanitize(c.header))
    .join(separator);
  lines.push(header);

  data?.forEach((d) => {
    const props = columns
      .map((c) => {
        try {
          return renderToString(c.render(d));
        } catch (error) {
          return c.renderString(d);
        }
      })
      .map((c) => (c != null ? c : ""))
      .join(separator);
    lines.push(props);
  });

  const csv = lines.join("\r\n");
  return csv;
}

export function writeCsv(fileName: string, csv: any) {
  console.log(csv);
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8",
  });

  FileSaver.saveAs(
    blob,
    `${fileName}_${format(new Date(), "yyyyMMdd-HHmm")}.csv`
  );
}

export function exportToCsv<Type>(
  columns: Column<Type>[],
  data: Type[],
  fileName: string
) {
  const csv = convertToCsv(columns, data);
  writeCsv(fileName, csv);
}

export function sanitize(desc: any) {
  let itemDesc;
  if (desc && typeof desc === "string") {
    itemDesc = desc.replace(/(\r\n|\n|\r|\s+|\t|&nbsp;)/gm, " ");
    itemDesc = itemDesc.replace(/"/g, '""');
    itemDesc = '"' + itemDesc + '"';
  } else {
    itemDesc = desc;
  }
  return itemDesc;
}
