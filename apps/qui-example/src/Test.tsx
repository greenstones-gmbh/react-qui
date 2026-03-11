import { BootstrapApp, NavLink } from "@clickapp/qui-bootstrap";
import { Nav } from "react-bootstrap";
import { BsBook } from "react-icons/bs";
import { BrowserRouter, Route } from "react-router-dom";
import { SimpleTable } from "./SimpleTable";
import { TodoListPage } from "./TodoListPage";

export function Test() {
  return (
    <BrowserRouter>
      <BootstrapApp
        projectName="Demo App"
        icon={BsBook}
        hideLayoutSwitcher={false}
        topnav={
          <Nav>
            <NavLink to="/" text="Home" />
            <NavLink to="/simple-table" text="Simple Table" />
            <NavLink to="/list-page" text="List Page" />
          </Nav>
        }
        publicRoutes={
          <>
            <Route index element={<SimpleTable />} />

            <Route path="/simple-table" element={<SimpleTable />} />
            <Route path="/list-page" element={<TodoListPage />} />
          </>
        }
      />
    </BrowserRouter>
  );
}
