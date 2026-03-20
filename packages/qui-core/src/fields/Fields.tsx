import type { HTMLAttributeAnchorTarget, ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";
import { DateFormatter } from "../components/DateFormatter";

// Fields

export interface Field<EntityType> {
  label: string;
  render(value: EntityType): ReactElement;
  renderString(value: EntityType): string | undefined;
}

// Fields builder

export interface RenderFieldFunction<EntityType, FieldType> {
  (field: FieldType, entity: EntityType): ReactElement;
}

export interface FieldConstructionOptions<EntityType, FieldType> {
  getter?: (value: EntityType) => FieldType | undefined;
}

export interface FieldRenderOptions<EntityType, FieldType> {
  label?: string;
  renderField?: RenderFieldFunction<EntityType, FieldType>;
  //renderToString?: (value: EntityType, context?: Context) => string | undefined;
  linkTo?: (entity: EntityType) => string;
}

export interface FieldOptions<EntityType, FieldType>
  extends
    FieldRenderOptions<EntityType, FieldType>,
    FieldConstructionOptions<EntityType, FieldType> {}

export function createField<EntityType, PropType>(
  options?: FieldOptions<EntityType, PropType>,
): Field<EntityType> {
  const render: (value: EntityType) => ReactElement = (v) => (
    <FieldValue v={v} options={options} />
  );
  return {
    label: options?.label || "-",
    render,
    renderString: (value) => {
      const v = options?.getter ? options?.getter(value) : value;
      return toString(v);
    },
  };
}

export function createFieldByNestedProp<EntityType, PropType>(
  prop: string,
  options?: FieldRenderOptions<EntityType, PropType>,
): Field<EntityType> {
  return createField({
    ...options,
    getter: (v) => getValue(v, prop),
    label: prop,
  });
}

export function createFieldByProp<EntityType, PropType>(
  prop: keyof EntityType,
  options?: FieldRenderOptions<EntityType, PropType>,
): Field<EntityType> {
  return createField({
    label: `${String(prop)}`,
    ...options,
    getter: (v) => v[prop] as PropType,
  });
}

const getValue = (v: any, prop: string | null = null) => {
  if (prop) {
    const parts = prop.split(".");
    let obj = v;
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

export const FieldRenderers = {
  asIsoDate:
    (
      type: "date" | "time" | "datetime" = "date",
    ): RenderFieldFunction<any, string> =>
    (v) => <DateFormatter isoString={v} type={type} />,

  asExternalLink<EntityType, FieldType>({
    className,
    target = "_blank",
    href,
    postEl,
    title,
  }: {
    className?: string;
    target?: HTMLAttributeAnchorTarget;
    href: (v: EntityType) => string | undefined;
    postEl?: ReactNode;
    title?: string;
  }): RenderFieldFunction<EntityType, FieldType> {
    return (v, e) => {
      const h = href(e);
      if (!h) return <Value value={v} />;
      return (
        <a
          href={href(e)}
          className={className}
          target={target}
          rel="noopener"
          title={title}
        >
          <Value value={v} />
          {postEl}
        </a>
      );
    };
  },
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

function FieldValue<Type, FieldType>({
  v,
  options = {},
}: {
  v: Type;
  options?: FieldOptions<Type, FieldType>;
}) {
  if (!options.getter) return <Value value={v} />;

  const prop = options.getter(v);
  if (prop == null) return null;

  if (options.linkTo) {
    return (
      <Link to={options.linkTo(v)}>
        {options.renderField ? (
          options.renderField(prop, v)
        ) : (
          <Value value={prop} />
        )}
      </Link>
    );
  }

  if (options.renderField) return options.renderField(prop, v);

  return <Value value={prop} />;
}
