import { useMemo, DependencyList } from "react";
import {
  Field,
  FieldRenderOptions,
  Fields,
  FieldOptions,
  createField,
} from "./Fields";

export interface ColumnOptions<EntityType> {
  header?: string;
  width?: number | string;
  sortKey?: string;
  className?: string | ((entity: EntityType) => string | undefined);
  headerClassName?: string;
}

export interface Column<EntityType> extends ColumnOptions<EntityType> {
  render: (entity: EntityType) => JSX.Element;
  renderString(value: EntityType): string | undefined;
}

export function createColumn<EntityType>(
  field: Field<EntityType>,
  options: ColumnOptions<EntityType> = {}
): Column<EntityType> {
  return {
    ...options,
    render: field.render,
    renderString: field.renderString,
    header: options.header || field.label,
  };
}

export function createColumnForProp<EntityType, PropType>(
  prop: string,
  options: ColumnOptions<EntityType> &
    FieldRenderOptions<EntityType, PropType> = {}
): Column<EntityType> {
  const field = Fields.byNestedProp(prop, options);
  return createColumn(field, { sortKey: prop, ...options });
}

export class ColumnBuilder<Type> {
  columns: Column<Type>[] = [];

  column<PropType = string>(
    prop: Extract<keyof Type, string>,
    options: ColumnOptions<Type> & FieldRenderOptions<Type, PropType> = {}
  ): ColumnBuilder<Type> {
    return this.prop(prop, options);
  }

  prop<PropType = string>(
    prop: string,
    options: ColumnOptions<Type> & FieldRenderOptions<Type, PropType> = {}
  ): ColumnBuilder<Type> {
    const field = Fields.byNestedProp(prop, options);
    return this.field(field, { sortKey: prop, ...options });
  }

  label<PropType = string>(
    label: string,
    options: ColumnOptions<Type> & FieldOptions<Type, PropType> = {}
  ): ColumnBuilder<Type> {
    const field = createField({ label, ...options });
    return this.field(field, options);
  }

  field(field: Field<Type>, options: ColumnOptions<Type>): ColumnBuilder<Type> {
    const col = createColumn(field, options);
    return this.add(col);
  }

  add(column: Column<Type>): ColumnBuilder<Type> {
    this.columns.push(column);
    return this;
  }
}

export function createColumns<Type = any>(
  configurer?: (builder: ColumnBuilder<Type>) => void
) {
  const tb = new ColumnBuilder<Type>();
  configurer?.(tb);
  return tb.columns;
}

export function filterColumns<Type = any>(
  columns: Column<Type>[],
  excludeHeaders: string[]
) {
  return columns.filter((c) => excludeHeaders.indexOf(c.header ?? "-") === -1);
}

export function useColumnGenerator<Type>(
  items: Type[] | undefined
): Column<Type>[] {
  return useMemo<Column<Type>[]>(() => {
    return createColumns<Type>((b) => {
      if (items && items.length > 0) {
        const t = items[0] as any;
        Object.keys(t).map((f) => b.prop(f));
      }
    });
  }, [items]);
}

export function useColumnBuilder<Type>(
  configurer: (builder: ColumnBuilder<Type>) => void,
  deps: DependencyList = []
) {
  const cols = useMemo(() => {
    return createColumns<Type>(configurer);
  }, deps);
  return cols;
}
