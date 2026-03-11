import { ErrorMessage } from "@hookform/error-message";
//import { parse } from "date-fns";
import { useMemo } from "react";
import { Form } from "react-bootstrap";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  useController,
  useFormContext,
} from "react-hook-form";

export interface DateFieldProps<Type extends FieldValues> {
  name: Path<Type>;
  label?: string;
  type?: string;
  ops?: Omit<
    RegisterOptions,
    "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
  >;
  placeholder?: string;
  className?: string;
}

export function DateField<Type extends FieldValues>({
  name,
  label,
  type = "date",
  ops = {},
  placeholder,
}: DateFieldProps<Type>) {
  const {
    formState: { errors },
    control,
    setValue,
  } = useFormContext<Type>();

  const { field } = useController({
    name,
    control,
    rules: { ...(ops as any) },
  });

  const v = useMemo(() => {
    if (field.value && (field.value as any) instanceof Date) {
      return field.value.toISOString().substring(0, 10);
    }
    if (field.value && typeof field.value === "string") {
      return field.value.substring(0, 10);
    }
    return field.value;
  }, [field.value]);

  // const onChange = (e: any) => {
  //   const v = parse(e.target.value, "yyyy-MM-dd", new Date());
  //   setValue(name, v as any, { shouldValidate: true });
  // };

  const fieldErrors = (errors as any)[name];

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label || name}</Form.Label>

      <Form.Control
        isInvalid={!!fieldErrors}
        type={type}
        placeholder={placeholder}
        onChange={field.onChange}
        onBlur={field.onBlur}
        value={v}
        name={field.name}
        ref={field.ref}
      />

      <ErrorMessage
        errors={errors}
        name={name as any}
        render={({ message }) => (
          <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
            <>{message}</>
          </Form.Control.Feedback>
        )}
      />
    </Form.Group>
  );
}
