import { useMemo, DependencyList } from "react";
import {
  Field,
  FieldRenderOptions,
  Fields,
  FieldOptions,
  createField,
} from "./Fields";

export interface Column<EntityType, Context = any> {
  width?: number | string;
  sortKey?: string;
  render: (entity: EntityType, context?: Context) => JSX.Element;
  renderString(value: EntityType, context?: Context): string | undefined;
  header?: string;
  className?: string | ((entity: EntityType) => string | undefined);
  headerClassName?: string;
}

export interface ColumnOptions<EntityType> {
  header?: string;
  width?: number | string;
  sortKey?: string;
  className?: string | ((entity: EntityType) => string | undefined);
  headerClassName?: string;
}

export function createColumn<EntityType, Context>(
  field: Field<EntityType, Context>,
  options: ColumnOptions<EntityType> = {}
): Column<EntityType, Context> {
  return {
    width: options.width,
    sortKey: options.sortKey,
    render: field.render,
    renderString: field.renderString,
    header: options.header || field.label,
    className: options.className,
    headerClassName: options.headerClassName,
  };
}

export function createColumnForProp<EntityType, PropType, Context>(
  prop: string,
  options: ColumnOptions<EntityType> &
    FieldRenderOptions<EntityType, PropType, Context> = {}
): Column<EntityType, Context> {
  const field = Fields.byNestedProp(prop, options);
  return createColumn(field, { sortKey: prop, ...options });
}

export class ColumnBuilder<Type, Context> {
  columns: Column<Type, Context>[] = [];

  column<PropType = string>(
    prop: string,
    options: ColumnOptions<Type> &
      FieldRenderOptions<Type, PropType, Context> = {}
  ): ColumnBuilder<Type, Context> {
    return this.prop(prop, options);
  }

  prop<PropType = string>(
    prop: string,
    options: ColumnOptions<Type> &
      FieldRenderOptions<Type, PropType, Context> = {}
  ): ColumnBuilder<Type, Context> {
    const field = Fields.byNestedProp(prop, options);
    return this.addField(field, { sortKey: prop, ...options });
  }

  col<PropType = string>(
    label: string,
    options: ColumnOptions<Type> & FieldOptions<Type, PropType, Context> = {}
  ): ColumnBuilder<Type, Context> {
    const field = createField({ label, ...options });
    return this.addField(field, options);
  }

  addField(
    field: Field<Type, Context>,
    options: ColumnOptions<Type>
  ): ColumnBuilder<Type, Context> {
    const col = createColumn(field, options);
    return this.add(col);
  }

  add(column: Column<Type, Context>): ColumnBuilder<Type, Context> {
    this.columns.push(column);
    return this;
  }
}

export function createColumns<Type = any, Context = any>(
  configurer?: (builder: ColumnBuilder<Type, Context>) => void
) {
  const tb = new ColumnBuilder<Type, Context>();
  configurer?.(tb);
  return tb.columns;
}

export function filterColumns<Type = any, Context = any>(
  columns: Column<Type, Context>[],
  excludeHeaders: string[]
) {
  return columns.filter((c) => excludeHeaders.indexOf(c.header ?? "-") === -1);
}

export function useColumnGenerator<Type, Context>(
  items: Type[] | undefined
): Column<Type, Context>[] {
  return useMemo<Column<Type, Context>[]>(() => {
    return createColumns<Type>((b) => {
      if (items && items.length > 0) {
        const t = items[0] as any;
        Object.keys(t).map((f) => b.col(f));
      }
    });
  }, [items]);
}

export function useColumnBuilder<Type, Context>(
  configurer: (builder: ColumnBuilder<Type, Context>) => void,
  deps: DependencyList = []
) {
  const cols = useMemo(() => {
    return createColumns<Type, Context>(configurer);
  }, deps);
  return cols;
}
