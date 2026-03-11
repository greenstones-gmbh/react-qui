import { Form } from "react-bootstrap";
import { type FieldValues, useFormContext } from "react-hook-form";
import { type InputFieldProps } from "./InputField";

export function CheckField<Type extends FieldValues>({
  name,
  label,
  ops = {},
  className = "mb-3",
}: InputFieldProps<Type>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<Type>();

  const fieldErrors = (errors as any)[name];
  return (
    <Form.Group className={className}>
      {/* <Form.Label>{label}</Form.Label> */}

      <Form.Check
        id={name}
        label={label}
        isInvalid={!!fieldErrors}
        type="checkbox"
        {...register(name, ops as any)}
      />

      {fieldErrors && (
        <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
          <>{fieldErrors.message}</>
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}
