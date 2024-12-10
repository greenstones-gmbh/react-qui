import { Form } from "react-bootstrap";
import {
  FieldValues,
  Path,
  RegisterOptions,
  useFormContext,
} from "react-hook-form";

export interface InputFieldProps<Type extends FieldValues> {
  name: Path<Type>;
  label: string;
  ops?: RegisterOptions;
}

export function InputField<Type extends FieldValues>({
  name,
  label,
  ops = {},
}: InputFieldProps<Type>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<Type>();

  const fieldErrors = (errors as any)[name];
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>

      <Form.Control
        isInvalid={!!fieldErrors}
        type="text"
        placeholder=""
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
