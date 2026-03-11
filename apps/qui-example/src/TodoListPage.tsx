import { ListPage, Page, QuickTable } from "@clickapp/qui-bootstrap";
import {
  Filters,
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
  company: {
    name: string;
    bs: string;
  };
}

export function TodoListPage() {
  const { data, isPending } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users",
  );

  const list = useArray(data, {
    filter: Filters.objectContains(),
    sorter: Sorters.objectProps(),
  });

  const columns1 = useColumnBuilder<User>((b) =>
    b
      .column("id")
      .column("username", { header: "Username" })
      .column("name")
      .column("email")
      .column("phone")
      .prop("company.name", { header: "Company" }),
  );

  return <ListPage header="List Page" list={list} columns={columns1} />;
}
