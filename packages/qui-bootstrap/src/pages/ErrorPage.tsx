import { Alert } from "react-bootstrap";
import { Page } from "./Page";
import { BasePage } from "./BasePage";
import { PropsWithChildren } from "react";

export function ErrorPage({
  title,
  children,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <BasePage className="bg-light">
      <div className="my-auto mx-auto ">
        <div
          className="text-center text-secondary bg-light p-4 rounded "
          style={{ marginTop: 0, maxWidth: 800 }}
        >
          <Alert variant="danger">
            {title && <Alert.Heading>{title}</Alert.Heading>}
            <div className="overflow-auto mt-3" style={{ maxHeight: 400 }}>
              {children}
            </div>
          </Alert>
        </div>
      </div>
    </BasePage>
  );
}

export function GenericErrorPage({
  error,
}: PropsWithChildren<{ error: Error }>) {
  return (
    <ErrorPage title="Oops! Something went wrong. Please contact the administrator.">
      {error?.message}
    </ErrorPage>
  );
}

export const GlobalErrorPage = ({ error }: any) => {
  //printError(error);
  return (
    <div className="vh-100 d-flex">
      <Page className="bg-light">
        <div className="my-auto mx-auto ">
          <div
            className="text-center text-secondary bg-light p-4 rounded "
            style={{ marginTop: -100 }}
          >
            <Alert variant="danger">
              <Alert.Heading>Es ist ein Fehler aufgetretten.</Alert.Heading>
              Bitte benachrichtigen Sie Ihren Administrator oder versuchen Sie
              die Seite zu aktualisieren.
              <hr />
              <div style={{ maxWidth: 500 }}>
                {error && (
                  <>
                    <div>
                      <b>{error.message}</b>
                    </div>

                    {error.response && (
                      <>
                        URL: {error.response?.config?.url} <br />
                        Error: {JSON.stringify(error.response?.data)} <br />
                      </>
                    )}

                    {/* <details style={{ whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(error.response)}
                    </details> */}
                  </>
                )}
              </div>
            </Alert>
          </div>
        </div>
      </Page>
    </div>
  );
};
