import { Spinner } from "react-bootstrap";
import { BasePage } from "./BasePage";

export function LoadingPage({ title = "Please wait..." }: any) {
  return (
    <BasePage className="bg-light">
      <div className="my-auto mx-auto ">
        <div
          className="text-center text-secondary bg-light p-4 rounded "
          style={{ marginTop: -100 }}
        >
          <span>
            <Spinner animation="grow" variant="secondary" />
            <br />
            {title}
          </span>
        </div>
      </div>
    </BasePage>
  );
}
