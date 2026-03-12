import { Alert } from "react-bootstrap";
import { BasePage } from "./BasePage";

export const MessagePage = ({ children }: any) => (
  <BasePage className="bg-light">
    <div className="my-auto mx-auto ">
      <div
        className="text-center text-secondary1 bg-light1 p-5 rounded1 "
        style={{ marginTop: -100, minWidth: 600 }}
      >
        <Alert variant="light">{children}</Alert>
      </div>
    </div>
  </BasePage>
);
