import { ReactNode } from "react";
import { Form } from "react-bootstrap";
import {
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

export interface SelectFieldProps<Type extends FieldValues> {
  name: Path<Type>;
  label?: string;
  children?: ReactNode;
  ops?: RegisterOptions;
  multiple?: boolean;
}

export function SelectField<Type extends FieldValues>({
  name,
  label,
  children,
  ops = {},
  multiple,
}: SelectFieldProps<Type>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<Type>();

  const fieldErrors = (errors as any)[name];
  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label || name}</Form.Label>

      <Form.Select
        {...register(name, ops as any)}
        isInvalid={!!fieldErrors}
        multiple={multiple}
      >
        {children}
      </Form.Select>

      {fieldErrors && (
        <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
          <>{fieldErrors.message}</>
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}
