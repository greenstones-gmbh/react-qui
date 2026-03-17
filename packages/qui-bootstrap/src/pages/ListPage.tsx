import {
  type Column,
  type ListData,
  type ListQuery,
} from "@greenstones/qui-core";
import type { PropsWithChildren, ReactNode } from "react";

import { ButtonToolbar } from "react-bootstrap";
import { ActionButton, type ActionButtonDisplayProps } from "../buttons";

import {
  Paging,
  QueryInput,
  QuickTable,
  type QuickTableDisplayProps,
} from "../tables";
import { Page } from "./Page";
import { type BaseListActions } from "../actions";

interface ListPageProps<Type, Query> {
  header?: ReactNode;
  list: ListData<Type, Query>;
  toolbar?: ReactNode;
  toolbarContent?: ReactNode;
  actions?: BaseListActions;
  columns: Column<Type>[];
  filterField?: keyof Query;
  createButtonProps?: ActionButtonDisplayProps;
  tableProps?: QuickTableDisplayProps<Type>;
  breadcrumb?: ReactNode;
}

export function ListPage<Type, Query>(props: ListPageProps<Type, Query>) {
  const toolbar = props.toolbar || (
    <ListPageToolbar
      query={props.list.query}
      filterField={props.filterField}
      createButtonProps={props.createButtonProps}
      onCreate={
        props?.actions?.create
          ? async () => {
              return await props?.actions?.create?.();
            }
          : undefined
      }
    >
      {props.toolbarContent}
    </ListPageToolbar>
  );

  return (
    <Page
      header={props.header}
      subheader={toolbar}
      breadcrumb={props.breadcrumb}
      footer={<Paging paging={props.list.paging} />}
    >
      <QuickTable
        {...props.tableProps}
        items={props.list.items}
        sorting={props.list.sorting}
        columns={props.columns}
      />
    </Page>
  );
}

export interface ListPageToolbarProps<Query> extends PropsWithChildren {
  query?: ListQuery<Query>;
  filterField?: keyof Query;
  onCreate?: () => Promise<void>;
  createButtonProps?: ActionButtonDisplayProps;
}

export function ListPageToolbar<Query>(props: ListPageToolbarProps<Query>) {
  const createProps = {
    variant: "primary",
    size: "sm",
    className: "ms-auto",
    label: "Add",
    ...props.createButtonProps,
  } as ActionButtonDisplayProps;
  return (
    <ButtonToolbar>
      {props.query && (
        <QueryInput
          query={props.query}
          field={props.filterField}
          className="me-2"
        />
      )}

      {props.children}

      {props.onCreate && (
        <ActionButton {...createProps} onClick={props.onCreate} />
      )}
    </ButtonToolbar>
  );
}
