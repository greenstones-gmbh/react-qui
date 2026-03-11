import { Page, QuickTable } from "@clickapp/qui-bootstrap";
import {
  Sorters,
  useArray,
  useColumnBuilder,
  useColumnGenerator,
  useFetch,
  useList,
} from "@clickapp/qui-core";
import { Breadcrumb } from "react-bootstrap";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

export function SimpleTable() {
  const { data } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users",
  );

  const { items, sorting } = useArray(data, { sorter: Sorters.objectProps() });
  const columns = useColumnGenerator(items);

  return (
    <Page header="Simple Table">
      <QuickTable items={items} columns={columns} sorting={sorting} />
    </Page>
  );
}
