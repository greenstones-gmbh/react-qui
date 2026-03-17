import { AssistantButton, useChat } from "@greenstones/qui-ai";
import { ListPage } from "@greenstones/qui-bootstrap";
import {
  Filters,
  Sorters,
  useArray,
  useColumnBuilder,
  useFetch,
} from "@greenstones/qui-core";
import { appAgent, appAgentSession } from "../AppAgent";

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

  const chat = useChat({
    agent: appAgent,
    session: appAgentSession,
  });

  return (
    <ListPage header="List Page" list={list} columns={columns1}>
      <AssistantButton chat={chat} />
    </ListPage>
  );
}
