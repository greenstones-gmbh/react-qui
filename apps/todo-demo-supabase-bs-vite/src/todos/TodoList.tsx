import { useColumnBuilder } from "@clickapp/qui-core";

import {
  ActionButton,
  ListActionsColumns,
  ListPage,
  QueryDropdown,
} from "@clickapp/qui-bootstrap";

import { Todo, TodoColumns, useTodoList } from "./Todos";
import { useTodoActions } from "./useTodoActions";

// ListPage

export function TodoList() {
  const list = useTodoList();

  const actions = useTodoActions({
    onSuccess: () => {
      list.sourceData.reload();
    },
  });

  const columns = useColumnBuilder<Todo>(
    (builder) => {
      builder
        .column("id")
        .add(TodoColumns.date)
        .column("task", {
          header: "Task",
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
        .add(ListActionsColumns.editDeleteCopyButtons(actions));
    },
    [actions]
  );

  return (
    <ListPage
      header="Todos - Simple"
      columns={columns}
      list={list}
      actions={actions}
      createButtonProps={{ label: "Add Todo" }}
      filterField="filter"
      toolbarContent={
        <>
          <QueryDropdown
            query={list.query!}
            field="hideCompleted"
            label="Is complete?"
            values={[true, false]}
            labels={["Yes", "No"]}
          />
        </>
      }
    />
  );
}
