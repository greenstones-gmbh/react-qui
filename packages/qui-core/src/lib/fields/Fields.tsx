import { Link } from "react-router-dom";
import { DateFormatter } from "../components/DateFormatter";

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
  options?: FieldOptions<EntityType, PropType, Context>
): Field<EntityType, Context> {
  const render: (value: EntityType, context?: Context) => JSX.Element = (
    v,
    context
  ) => <FieldValue v={v} options={options} context={context} />;
  return {
    label: options?.label || "-",
    render,
    renderString: (value, context) => {
      const v = options?.getter ? options?.getter(value, context) : value;
      return toString(v);
    },
  };
}

export function createFieldByNestedProp<EntityType, PropType, Context>(
  prop: string,
  options?: FieldRenderOptions<EntityType, PropType, Context>
): Field<EntityType, Context> {
  return createField({
    ...options,
    getter: (v) => getValue(v, prop),
    label: prop,
  });
}

export function createFieldByProp<EntityType, PropType, Context>(
  prop: keyof EntityType,
  options?: FieldRenderOptions<EntityType, PropType, Context>
): Field<EntityType, Context> {
  return createField({
    label: `${String(prop)}`,
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

export const FieldRenderers = {
  asIsoDate:
    (
      type: "date" | "time" | "datetime" = "date"
    ): RenderFieldFunction<any, string, any> =>
    (v) =>
      <DateFormatter isoString={v} type={type} />,
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
  options = {},
}: {
  v: Type;
  context?: Context;
  options?: FieldOptions<Type, FieldType, Context>;
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
