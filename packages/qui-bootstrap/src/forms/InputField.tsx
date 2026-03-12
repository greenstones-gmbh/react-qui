import { ErrorMessage } from "@hookform/error-message";
import { Form } from "react-bootstrap";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form";

export interface InputFieldProps<Type extends FieldValues> {
  name: Path<Type>;
  label?: string;
  type?: string;
  ops?: RegisterOptions;
  as?: "input" | "textarea" | undefined;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export function InputField<Type extends FieldValues>({
  name,
  label,
  type,
  as,
  ops = {},
  rows,
  placeholder,
}: InputFieldProps<Type>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<Type>();

  //const setValueAs = (v: string) => (v === "" ? undefined : v);

  const fieldErrors = (errors as any)[name];

  const attrs = as === "textarea" ? { rows: rows ?? 3 } : { placeholder };

  return (
    <Form.Group className="mb-3">
      <Form.Label>{label || name}</Form.Label>

      <Form.Control
        isInvalid={!!fieldErrors}
        type={type}
        as={as}
        {...attrs}
        {...register(name, { ...(ops as any) })}
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
