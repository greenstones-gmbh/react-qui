import { Table } from "react-bootstrap";

export function DetailTable({
  data,
  className,
  excludes = [],
  hideEmptyProps = false,
}: any) {
  return (
    <Table size="sm" className={className}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data)
          .filter((key) => excludes.indexOf(key) === -1)
          .map((key) => ({ key, value: data[key] }))
          .filter(({ key, value }) => !hideEmptyProps || value)
          .map(({ key, value }) => {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{renderValue(value)}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}
function renderValue(v: any, hideEmptyProps = false) {
  if (!v) return "";
  if (typeof v === "object")
    return <DetailTable data={v} hideEmptyProps={hideEmptyProps} />;
  return v;
}
