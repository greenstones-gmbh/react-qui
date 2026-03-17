import {
  ActionButton,
  DetailModelView,
  ListItemButtons,
  ListPage,
  Page,
  QuickTable,
  Scrollable,
  Tabs,
} from "@greenstones/qui-bootstrap";
import {
  Fields,
  Filters,
  ListData,
  Sorters,
  useArray,
  useColumnBuilder,
  useColumnGenerator,
  useDetaiModelBuilder,
  useFetch,
  useList,
} from "@greenstones/qui-core";
import { Columns } from "lucide-react";
import { useMemo } from "react";
import { Badge, Breadcrumb, ButtonToolbar, Tab } from "react-bootstrap";
import { MdOutlineCheckCircle } from "react-icons/md";
import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";

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

export function MasterDetailContainer() {
  const { data, isPending } = useFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users",
  );

  const list = useArray(data, {
    filter: Filters.objectContains(),
    sorter: Sorters.objectProps(),
  });

  return <Outlet context={{ list }} />;
}

export function MasterDetailListPage() {
  const { list } = useOutletContext<{
    list: ListData<User, string>;
  }>();

  const columns = useColumnBuilder<User>((b) =>
    b
      .column("id")
      .column("username", {
        header: "Username",
        linkTo: (v) => `/pages/master-details/${v.id}`,
      })
      .column("name")
      .column("email")
      .column("phone")
      .prop("company.name", { header: "Company" }),
  );

  return (
    <ListPage
      header="Master-Detail"
      list={list}
      columns={columns}
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Master-Dateils</Breadcrumb.Item>
        </Breadcrumb>
      }
    />
  );
}

export function MasterDetailPage() {
  const { id } = useParams();
  const { list } = useOutletContext<{
    list: ListData<User, any>;
  }>();

  const data = list.items?.find((u) => `${u.id}` === id);

  // const model = useDetaiModelGenerator(result?.data);
  const model = useDetaiModelBuilder<User>((b) => {
    b.addLine(Fields.byProp("id"));
    b.addLine(Fields.byProp("name"));
    b.block();
    b.addLine(Fields.byProp("email"));
    b.addLine(Fields.byProp("phone"));
    b.block();
    b.addLine(Fields.byNestedProp("company.name"));
    b.addLine(Fields.byNestedProp("company.bs"));
  });

  const { data: allPosts, isPending } = useFetch<any[]>(
    "https://jsonplaceholder.typicode.com/posts",
  );

  const posts = useMemo(
    () => allPosts?.filter((p) => `${p.userId}` === id),
    [allPosts],
  );

  //const postColumns = useColumnGenerator(allPosts);
  const postColumns = useColumnBuilder<any>((b) =>
    b.column("title").column("body"),
  );

  const { data: allTodos, isPending: isTodoPanding } = useFetch<any[]>(
    "https://jsonplaceholder.typicode.com/todos",
  );

  const todos = useMemo(
    () => allTodos?.filter((p) => `${p.userId}` === id),
    [allTodos],
  );

  //const todoColumns = useColumnGenerator(allTodos);
  const todoColumns = useColumnBuilder<any>((b) =>
    b
      .column("completed", {
        header: " ",
        width: "2rem",
        renderField: (v, entity) =>
          entity.completed ? <MdOutlineCheckCircle /> : <></>,
      })
      .column("title"),
  );

  return (
    <Page
      header={data?.username}
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: "/pages/master-details" }}
          >
            Master-Dateils
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{data?.username}</Breadcrumb.Item>
        </Breadcrumb>
      }
      // subheader={
      //   <ButtonToolbar>
      //     <ListItemButtons actions={actions} entity={result?.data} />
      //     <ActionButton
      //       size="sm"
      //       className="ms-4"
      //       variant="outline-primary"
      //       onClick={async () => {
      //         actions.complete(result?.data);
      //       }}
      //     >
      //       {result?.data?.is_complete ? "Reset" : "Complete"}
      //     </ActionButton>
      //   </ButtonToolbar>
      // }
    >
      {data && <DetailModelView className="mt-2" model={model} value={data} />}

      <Tabs defaultActiveKey="posts" className="mt-3">
        <Tab
          eventKey="posts"
          title={
            <>
              Posts{" "}
              <Badge className="ms-2 bg-light text-dark" pill>
                {posts?.length}
              </Badge>
            </>
          }
        >
          {/* <QuickTable items={posts} columns={postColumns} /> */}
          <Scrollable>
            <QuickTable items={posts} columns={postColumns} />
          </Scrollable>
        </Tab>
        <Tab
          eventKey="todos"
          title={
            <>
              Todos{" "}
              <Badge className="ms-2 bg-light text-dark" pill>
                {todos?.length}
              </Badge>
            </>
          }
        >
          <Scrollable>
            <QuickTable stripped items={todos} columns={todoColumns} />
          </Scrollable>
        </Tab>
      </Tabs>
    </Page>
  );
}
