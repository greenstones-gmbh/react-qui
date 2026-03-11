import { useState, type ReactElement } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form";

export function PickerField<Type extends FieldValues>({
  name,
  label,
  format,
  picker,
  ops = {},
}: {
  name: Path<Type>;
  label: string;
  format: (v: any) => string;
  picker: (params: any) => ReactElement;
  ops?: RegisterOptions;
}) {
  const [show, setShow] = useState(false);
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<Type>();

  register(name, ops as any);
  const v = getValues(name);
  const fieldErrors = (errors as any)[name];
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          isInvalid={!!fieldErrors}
          type="text"
          readOnly
          placeholder=""
          value={v ? format(v) : ""}
        />
        <Button variant="light" onClick={(e) => setShow(true)}>
          Choose...
        </Button>
      </InputGroup>
      {fieldErrors && (
        <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
          <>{fieldErrors.message}</>
        </Form.Control.Feedback>
      )}
      {show &&
        picker({
          close: () => setShow(false),
          onSelect: (s: any) => {
            setValue(name, s[0], { shouldValidate: true });
          },
        })}
    </Form.Group>
  );
}
