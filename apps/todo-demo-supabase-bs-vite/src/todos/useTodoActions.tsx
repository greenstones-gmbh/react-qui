import {
  CheckField,
  DateField,
  InputField,
  ListItemAction,
  ModalForm,
  ModalFormProps,
  NavigationProps,
  useListActions,
} from "@clickapp/qui-bootstrap";

import {
  Identifiable,
  useSupabaseTypedRepository,
} from "@clickapp/qui-supabase";

import { Database, Tables } from "./database.types";
import { useAuth } from "@clickapp/qui-core";

type Todo = Tables<"todos">;

export function useTodoActions({
  reloadList,
  reloadItem,
  navigationProps,
}: {
  reloadList?: (params?: any) => void;
  reloadItem?: (params?: any) => void;
  navigationProps?: NavigationProps<Todo>;
}) {
  const { user } = useAuth();

  const repository = useSupabaseTypedRepository<
    Database,
    "todos",
    Identifiable<number>
  >("todos");

  const actions = useListActions({
    repository,
    modal: (props) => <TodoModalForm {...props} />,
    editTitle: "Edit Todo",
    copyTitle: "Copy Todo",
    createTitle: "Create Todo",
    reloadList,
    reloadItem,
    navigationProps,
    createFormValues() {
      return {
        inserted_at: new Date().toISOString(),
        user_id: user.user.id,
      };
    },
  });

  const complete: ListItemAction<Todo> = async (e: Todo) => {
    await repository.update(e, { is_complete: !e.is_complete });
    reloadItem?.();
    reloadList?.();
  };

  return { ...actions, complete };
}

function TodoModalForm(props: ModalFormProps<Partial<Todo>>) {
  return (
    <ModalForm {...props}>
      <DateField
        name="inserted_at"
        type="date"
        ops={{ required: "This field is required." }}
      />
      <InputField name="task" ops={{ required: "This field is required" }} />
      <CheckField name="is_complete" label="Is Complete?" />
    </ModalForm>
  );
}
