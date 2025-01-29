import {
  CheckField,
  DateField,
  InputField,
  ModalForm,
  useListActions,
} from "@clickapp/qui-bootstrap";

import {
  createColumn,
  FieldRenderers,
  Fields,
  useAuth,
} from "@clickapp/qui-core";
import {
  Identifiable,
  useSupabaseTable,
  useSupabaseTypedRepository,
} from "@clickapp/qui-supabase";
import { Badge } from "react-bootstrap";
import { Database, Tables } from "./database.types";

export const TodoFields = {
  date: Fields.byProp("inserted_at", {
    renderField: FieldRenderers.asIsoDate("date"),
    label: "Date",
  }),

  doneBadge: Fields.byProp<any, any, any>("is_complete", {
    label: "Done",
    renderField: (v) => (v ? <Badge bg="success">Done</Badge> : <></>),
  }),
};

export const TodoColumns = {
  date: createColumn(TodoFields.date, {
    width: "10em",
    sortKey: "inserted_at",
  }),

  doneBadge: createColumn(TodoFields.doneBadge, {
    width: "10em",
    sortKey: "is_complete",
  }),
};

export interface TodoQuery {
  filter?: string;
  hideCompleted?: boolean;
}

export interface Todo {
  id: number;
  task: string;
  inserted_at: string;
  user_id: string;
  is_complete?: boolean;
}

export function useTodoList() {
  const todoList = useSupabaseTable<Todo, TodoQuery>("todos", {
    initialSort: { id: "task", direction: "asc" },
    initialPageSize: 200,

    filter(queryBuilder, query) {
      if (query?.filter) {
        queryBuilder.ilike("task", `%${query.filter}%`);
      }
      if (query?.hideCompleted) {
        queryBuilder.is("is_complete", false);
      }
    },
  });

  return { ...todoList };
}

export function useTodoActions(reload: any, navigationPath?: string) {
  const { user } = useAuth();

  const repository = useSupabaseTypedRepository<
    Database,
    "todos",
    Identifiable<number>
  >("todos");

  const actions = useListActions({
    modal: (props) => {
      return (
        <ModalForm {...props}>
          <DateField
            name="inserted_at"
            type="date"
            ops={{ required: "This field is required." }}
          />
          <InputField
            name="task"
            ops={{ required: "This field is required" }}
          />
          <CheckField name="is_complete" label="Is Complete?" />
        </ModalForm>
      );
    },
    repository,
    reload,
    defaultValuesOnCreate: () => ({
      user_id: user.user.id,
      inserted_at: new Date(),
    }),
    linkToList: navigationPath,
    linkToEntity: navigationPath
      ? (e) => `${navigationPath}/${e.id}`
      : undefined,
  });

  const complete = async (e: Todo) => {
    await repository.update(e, { is_complete: !e.is_complete });
    reload?.();
  };

  return { ...actions, complete };
}

interface TodoForm extends Record<string, any> {
  name: string;
  date: string;
  isDone: boolean;
}

export function useTodoActionsWithCustomForm(
  reload: any,
  navigationPath?: string
) {
  const { user } = useAuth();

  const repository = useSupabaseTypedRepository<
    Database,
    "todos",
    Identifiable<number>
  >("todos");

  const actions = useListActions<
    Tables<"todos">,
    Identifiable<number>,
    TodoForm
    // Tables<"todos">,
    // TablesInsert<"todos">,
    // TablesUpdate<"todos">
    // Omit<Todo, "id" | "user_id">,
    // Omit<Todo, "id">
  >({
    transformForEditing: (v) => ({
      name: v.task || "",
      date: v.inserted_at,
      isDone: v.is_complete || false,
    }),

    transformForCloning: (v) => ({
      name: v.task || "",
      date: v.inserted_at,
      isDone: v.is_complete || false,
    }),

    transformOnUpdate: (formValues) => ({
      task: formValues.name,
      inserted_at: formValues.date,
      is_complete: formValues.isDone,
    }),

    transformOnCreate: (formValues) => ({
      task: formValues.name,
      inserted_at: formValues.date,
      is_complete: formValues.isDone,
      user_id: user.user.id,
    }),

    modal: (props) => {
      return (
        <ModalForm {...props}>
          <DateField
            name="date"
            type="date"
            ops={{ required: "This field is required." }}
          />
          <InputField
            name="name"
            ops={{ required: "This field is required" }}
          />
          <CheckField name="isDone" />
        </ModalForm>
      );
    },
    repository,
    reload,
    defaultValuesOnCreate: () => ({
      date: new Date(),
    }),
    linkToList: navigationPath,
    linkToEntity: navigationPath
      ? (e) => `${navigationPath}/${e.id}`
      : undefined,
  });

  const complete = async (e: Todo) => {
    await repository.update(e, { is_complete: !e.is_complete });
    reload?.();
  };

  return { ...actions, complete };
}
