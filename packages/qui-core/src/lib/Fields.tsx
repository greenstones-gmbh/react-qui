import { Link } from "react-router-dom";
import DateFormatter from "./components/DateFormatter";
import { ReactNode, useMemo } from "react";

// Fields

export interface Field<EntityType, Context = any> {
  label: string;
  render(value: EntityType, context?: Context): JSX.Element;
  renderString(value: EntityType, context?: Context): string | undefined;
}

// Fields builder

export interface RenderFieldFunction<EntityType, FieldType, Context> {
  (field: FieldType, entity: EntityType, context?: Context): JSX.Element;
}

export interface FieldConstructionOptions<EntityType, FieldType, Context> {
  getter?: (value: EntityType, context?: Context) => FieldType | undefined;
}

export interface FieldRenderOptions<EntityType, FieldType, Context> {
  label?: string;
  renderField?: RenderFieldFunction<EntityType, FieldType, Context>;
  //renderToString?: (value: EntityType, context?: Context) => string | undefined;
  linkTo?: (value: FieldType, entity: EntityType, context?: Context) => string;
}

export interface FieldOptions<EntityType, FieldType, Context>
  extends FieldRenderOptions<EntityType, FieldType, Context>,
    FieldConstructionOptions<EntityType, FieldType, Context> {}

export function createField<EntityType, PropType, Context>(
  options: FieldOptions<EntityType, PropType, Context>
): Field<EntityType, Context> {
  const render: (value: EntityType, context?: Context) => JSX.Element = (
    v,
    context
  ) => <FieldValue v={v} options={options} context={context} />;
  return {
    label: options.label || "-",
    render,
    renderString: (value, context) => {
      const v = options.getter ? options.getter(value, context) : value;
      return toString(v);
    },
  };
}

export function createFieldByNestedProp<EntityType, PropType, Context>(
  prop: string,
  options: FieldRenderOptions<EntityType, PropType, Context>
): Field<EntityType, Context> {
  return createField({
    ...options,
    getter: (v) => getValue(v, prop),
    label: prop,
  });
}

export function createFieldByProp<EntityType, PropType, Context>(
  prop: keyof EntityType,
  options: FieldRenderOptions<EntityType, PropType, Context>
): Field<EntityType, Context> {
  return createField({
    ...options,
    getter: (v) => v[prop] as PropType,
  });
}

const getValue = (v: any, prop: string | null = null) => {
  if (prop) {
    const parts = prop.split(".");
    var obj = v;
    parts.forEach((prop) => {
      if (obj) {
        obj = obj[prop] || null;
      }
    });
    return obj;
  }
  return v;
};

export const Fields = {
  create: createField,
  byProp: createFieldByProp,
  byNestedProp: createFieldByNestedProp,
};

// Entity

export interface Column<EntityType, Context = any> {
  width?: number | string;
  sortKey?: string;
  render: (entity: EntityType, context?: Context) => JSX.Element;
  renderString(value: EntityType, context?: Context): string | undefined;
  header?: string;
  className?: string;
}

export interface ColumnOptions {
  header?: string;
  width?: number | string;
  sortKey?: string;
  className?: string;
}

export function createColumn<EntityType, Context>(
  field: Field<EntityType, Context>,
  options: ColumnOptions = {}
): Column<EntityType, Context> {
  return {
    width: options.width,
    sortKey: options.sortKey,
    render: field.render,
    renderString: field.renderString,
    header: options.header || field.label,
    className: options.className,
  };
}

export function createColumnForProp<EntityType, PropType, Context>(
  prop: string,
  options: ColumnOptions &
    FieldRenderOptions<EntityType, PropType, Context> = {}
): Column<EntityType, Context> {
  const field = Fields.byNestedProp(prop, options);
  return createColumn(field, { sortKey: prop, ...options });
}

export const FieldRenderers = {
  asIsoDate:
    (
      type: "date" | "time" | "datetime" = "date"
    ): RenderFieldFunction<any, string, any> =>
    (v) => <DateFormatter isoString={v} />,
};

function Value({ value }: { value: any }) {
  if (typeof value === "object") {
    return <>{JSON.stringify(value)}</>;
  }
  if (typeof value === "boolean") {
    return <>{value ? "true" : "false"}</>;
  }
  return <>{`${value}`}</>;
}

function toString(value: any) {
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return value;
}

function FieldValue<Type, FieldType, Context>({
  v,
  context,
  options,
}: {
  v: Type;
  context?: Context;
  options: FieldOptions<Type, FieldType, Context>;
}) {
  if (!options.getter) return <Value value={v} />;

  const prop = options.getter(v, context);
  if (prop == null) return null;

  if (options.linkTo) {
    return (
      <Link to={options.linkTo(prop, v, context)}>
        {options.renderField ? (
          options.renderField(prop, v, context)
        ) : (
          <Value value={prop} />
        )}
      </Link>
    );
  }

  if (options.renderField) return options.renderField(prop, v, context);

  return <Value value={prop} />;
}

export class ColumnBuilder<Type, Context> {
  columns: Column<Type, Context>[] = [];

  column<PropType = string>(
    prop: string,
    options: ColumnOptions & FieldRenderOptions<Type, PropType, Context> = {}
  ): ColumnBuilder<Type, Context> {
    return this.prop(prop, options);
  }

  prop<PropType = string>(
    prop: string,
    options: ColumnOptions & FieldRenderOptions<Type, PropType, Context> = {}
  ): ColumnBuilder<Type, Context> {
    const field = Fields.byNestedProp(prop, options);
    return this.addField(field, { sortKey: prop, ...options });
  }

  col<PropType = string>(
    label: string,
    options: ColumnOptions & FieldOptions<Type, PropType, Context> = {}
  ): ColumnBuilder<Type, Context> {
    const field = createField({ label, ...options });
    return this.addField(field, options);
  }

  addField(
    field: Field<Type, Context>,
    options: ColumnOptions
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

// class DetailBuilder<Type> {
//   groups: (Field<Type> | null)[][] = [];
//   fields: (Field<Type> | null)[] = [];

//   constructor() {
//     this.addGroup();
//   }

//   addGroup() {
//     this.fields = [];
//     this.groups.push(this.fields);
//     return this;
//   }

//   field<PropType = string>(
//     prop: string,
//     options: FieldRenderOptions<Type, PropType> = {}
//   ): DetailBuilder<Type> {
//     const field = Fields.byNestedProp(prop, options);
//     this.fields.push(field);
//     return this;
//   }

//   separator() {
//     this.fields.push(null);
//     return this;
//   }

//   build() {
//     return this.groups.map((g) =>
//       g.map((f) => {
//         if (f) {
//           return {
//             name: f.prop,
//             render: f._render,
//             label: this.labels[f.prop],
//             format: f._format,
//           };
//         }
//         return null;
//       })
//     );
//   }
// }
