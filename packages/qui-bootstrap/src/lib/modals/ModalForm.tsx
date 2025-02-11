import { ReactNode } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { useModals } from "./Modals";

export interface ModalFormDisplayProps {
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
  title: string;
  size?: "sm" | "lg" | "xl";
}

export interface ModalFormProps<Type extends FieldValues>
  extends ModalFormDisplayProps {
  handleClose: any;
  defaultValues?: DefaultValues<Type> | ((payload?: unknown) => Promise<Type>);
  onSubmit: (v: Type) => Promise<any>;
  children?: ReactNode | ((props: UseFormReturn<Type>) => ReactNode);
  transformOnSubmit?: (v: Type) => Promise<Type>;
}

export function ModalForm<Type extends FieldValues>({
  handleClose,
  defaultValues,
  onSubmit,
  title,
  submitButtonLabel,
  cancelButtonLabel,
  children,
  size = "lg",
  transformOnSubmit,
}: ModalFormProps<Type>) {
  const methods = useForm<Type>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { showErrorMessage } = useModals();

  const _onSubmit = handleSubmit(async (data) => {
    const v = transformOnSubmit ? await transformOnSubmit(data) : data;
    try {
      await onSubmit(v);
    } catch (error) {
      showErrorMessage({ error });
    }
  });

  return (
    <FormProvider {...methods}>
      <Modal
        show={true}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        size={size}
      >
        <Form noValidate onSubmit={_onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {typeof children === "function" ? children(methods) : children}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {cancelButtonLabel || "Cancel"}
            </Button>
            <Button variant="primary" type="submit">
              {isSubmitting && <Spinner animation="border" size="sm" />}{" "}
              {submitButtonLabel || "Submit"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </FormProvider>
  );
}
