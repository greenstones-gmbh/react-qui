import { useState, type ReactElement } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@greenstones/qui-core";
import { useLocation } from "react-router-dom";

type Inputs = {
  email: string;
  password: string;
};

const SocialProviderButtons: { [id: string]: ReactElement } = {
  bitbucket: (
    <SignInWithOAuthProviderButton provider="bitbucket" name="Bitbucket" />
  ),
  azure: <SignInWithOAuthProviderButton provider="azure" name="Azure" />,
  google: <SignInWithOAuthProviderButton provider="google" name="Google" />,
};

export function SignInPage({
  title = "Project",
  subtitle = "Sign in to your account",
  enableSignWithPassword = true,
  providers,
  children,
}: {
  title?: string;
  subtitle?: string;
  enableSignWithPassword?: boolean;
  providers?: string[];
  children?: any;
}) {
  return (
    <SignInPageContainer>
      <h3 className="text-center mb-0">{title}</h3>
      <p className="text-center text-muted">{subtitle}</p>
      {enableSignWithPassword && <SignInWithPassword />}
      {enableSignWithPassword && providers && <hr className="my-4" />}
      {providers && (
        <div className="d-grid gap-2">
          {providers?.map((p) => SocialProviderButtons[p])}
        </div>
      )}
      {children}
    </SignInPageContainer>
  );
}

export function SignInPageContainer({ children }: any) {
  return (
    <div className="vh-100 bg-body-tertiary w-100 d-flex align-items-center">
      <div
        className="bg-white mx-auto p-5 rounded border "
        style={{ width: 400 }}
      >
        {children}
      </div>
    </div>
  );
}

export function SignInWithOAuthProviderButton({
  provider,
  name,
}: {
  provider: string;
  name: string;
}) {
  const { state } = useLocation();
  const { redirectTo } = state || {};

  const { loginWithOAuth } = useAuth();
  return (
    <Button
      variant="outline-primary"
      onClick={() => {
        loginWithOAuth?.(provider, redirectTo);
      }}
    >
      Sign in with {name}
    </Button>
  );
}

export function SignInWithPassword() {
  const { loginWithPassword } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  const { state } = useLocation();
  const { redirectTo } = state || {};

  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await loginWithPassword?.(data.email, data.password, redirectTo);
      setErrorMsg(undefined);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMsg(e.message);
      } else {
        console.error(e);
        setErrorMsg("Error!");
      }
    }
  };

  return (
    <>
      {errorMsg && (
        <Alert variant="danger" className="text-center mb-3">
          {errorMsg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)} className="">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email or username"
            {...register("email", {
              required: "Username is required",
            })}
          />
          {/* {errors.email && <p role="alert">{errors.email.message}</p>} */}
        </Form.Group>

        <Form.Group className="mb-2" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" type="submit" className="mt-3">
            Sign In
          </Button>
        </div>
      </Form>
    </>
  );
}
