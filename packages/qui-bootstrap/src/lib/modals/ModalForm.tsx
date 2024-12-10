import { PropsWithChildren } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

type Inputs = {
  email: string;
  password: string;
};

export function ModalForm({
  handleClose,
  children,
}: PropsWithChildren<{ handleClose: any }>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<{
    email: string;
    password: string;
    bts: string;
  }>();

  const params = useParams();

  console.log("ModalForm.params", params);

  //const onSubmit: SubmitHandler<Inputs> = async (data) => {};
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  return (
    <Modal show={true} onHide={handleClose} backdrop="static" keyboard={true}>
      <Form noValidate onSubmit={onSubmit} validated={isSubmitted}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Form</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.email}
              placeholder="Enter email or username"
              {...register("email", {
                required: "Username is required",
                minLength: { value: 3, message: "min length 3" },
              })}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            // disabled={isSubmitting || !isValid}
            // disabled={
            //   isSubmitting || !successButtonEnabled
            //   //||(successButtonEnabledOnlyOnValid && !isValid)
            // }
          >
            {/* {isSubmitting && <Spinner animation="border" size="sm" />}{" "}
            {successButtonLabel} */}
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
