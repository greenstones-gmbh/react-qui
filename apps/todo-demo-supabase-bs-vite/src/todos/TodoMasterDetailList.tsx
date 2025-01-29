import {
  ActionButton,
  DetailModelView,
  ListActionsColumns,
  ListItemButtons,
  ListPage,
  Page,
  QueryCheckbox,
} from "@clickapp/qui-bootstrap";

import {
  Fields,
  ListData,
  useColumnBuilder,
  useDetaiModelBuilder,
} from "@clickapp/qui-core";
import { useSupabaseQuery } from "@clickapp/qui-supabase";
import { Breadcrumb, ButtonToolbar } from "react-bootstrap";
import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";

import {
  TodoColumns,
  TodoFields,
  TodoQuery,
  useTodoActionsWithCustomForm,
  useTodoList,
} from "./Todos";

import { MdOutlineCheckCircle } from "react-icons/md";
import { Tables } from "./database.types";

type Todo = Tables<"todos">;

// MasterDetail

export function TodoMasterDetailContainer() {
  const list = useTodoList();

  return <Outlet context={{ list }} />;
}

export function TodoMasterDetailListPage() {
  const { list } = useOutletContext<{
    list: ListData<Todo, TodoQuery>;
  }>();

  const actions = useTodoActionsWithCustomForm(
    list.sourceData.reload,
    "/todos"
  );
  const columns = useColumnBuilder<Todo, TodoQuery>(
    (builder) => {
      builder
        .column("id", {
          header: " ",
          width: "2em",
          renderField: (v, entity) =>
            entity.is_complete ? <MdOutlineCheckCircle /> : <></>,
        })
        .add(TodoColumns.date)
        .column("task", {
          header: "Task",
          linkTo: (value, entity) => `/todos/${entity.id}`,
          className: (entity) =>
            entity.is_complete ? "text-decoration-line-through " : undefined,
        })
        .add(TodoColumns.doneBadge)
        .add(
          ListActionsColumns.column((v) => (
            <ActionButton
              size="sm"
              variant="light"
              hideLabelOnRunning={true}
              onClick={async () => {
                await actions.complete?.(v);
              }}
            >
              {v.is_complete ? "Reset" : "Complete"}
            </ActionButton>
          ))
        )
        .add(ListActionsColumns.editDeleteButtons(actions as any));
    },
    [actions]
  );

  return (
    <ListPage
      list={list}
      filterField={"filter"}
      tableProps={{
        hover: true,
        rowClassName: (v) => (v.is_complete ? "table-light" : undefined),
      }}
      header={"Todos - Master-Detail"}
      columns={columns}
      actions={actions}
      toolbarContent={
        <>
          <QueryCheckbox
            query={list.query}
            field="hideCompleted"
            label="Hide completed"
          />
          <ActionButton
            className="ms-4"
            size="sm"
            variant="outline-primary"
            onClick={list.sourceData.reload}
          >
            Reload
          </ActionButton>
        </>
      }
    />
  );
}

export function TodoMasterDetailPage() {
  const { id } = useParams();
  const { list } = useOutletContext<{
    list: ListData<any, any>;
  }>();

  const actions = useTodoActionsWithCustomForm(() => {
    list.sourceData.reload();
    result.reload();
  }, "/todos");

  const result = useSupabaseQuery(
    (supabase, id) => supabase.from("todos").select("*").eq("id", id).single(),
    id
  );

  // const model = useDetaiModelGenerator(result?.data);
  const model = useDetaiModelBuilder<Todo>((b) => {
    b.addLine(Fields.byProp("id"));
    b.addLine(Fields.byProp("user_id"));

    b.addLine(Fields.byProp("task"));
    b.block();
    b.addLine(TodoFields.date);
    b.addLine(TodoFields.doneBadge);
  });

  return (
    <Page
      header={result.data?.task}
      loading={result.isPending}
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/todos" }}>
            Todos
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{result?.data?.id}</Breadcrumb.Item>
        </Breadcrumb>
      }
      subheader={
        <ButtonToolbar>
          <ListItemButtons actions={actions} entity={result?.data} />
          <ActionButton
            size="sm"
            className="ms-4"
            variant="outline-primary"
            onClick={async () => {
              actions.complete(result?.data);
            }}
          >
            {result?.data?.is_complete ? "Reset" : "Complete"}
          </ActionButton>
        </ButtonToolbar>
      }
    >
      {result?.data && (
        <DetailModelView className="mt-2" model={model} value={result?.data} />
      )}
    </Page>
  );
}
