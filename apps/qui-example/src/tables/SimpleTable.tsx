import { AssistantButton, useChat } from "@greenstones/qui-ai";
import { Page, QuickTable } from "@greenstones/qui-bootstrap";
import {
  Sorters,
  useArray,
  useColumnGenerator,
  useFetch,
} from "@greenstones/qui-core";
import { Bot } from "lucide-react";
import { useState } from "react";
import { Button, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import { appAgent, appAgentSession } from "../AppAgent";

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

  const chat = useChat({
    agent: appAgent,
    session: appAgentSession,
  });

  return (
    <Page header="Simple Table">
      <QuickTable items={items} columns={columns} sorting={sorting} />
      <AssistantButton chat={chat} />
    </Page>
  );
}
