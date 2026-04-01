import {
  BootstrapApp,
  LoadingPage,
  MessagePage,
  NavLink,
} from "@greenstones/qui-bootstrap";
import { Nav, NavDropdown } from "react-bootstrap";
import { BsBook } from "react-icons/bs";
import { BrowserRouter, Route } from "react-router-dom";
import { ChatLight } from "./agents/ChatLight";
import { WeatherAgentPage } from "./agents/WeatherAgentPage";
import {
  MasterDetailContainer,
  MasterDetailListPage,
  MasterDetailPage,
} from "./pages/MasterDetailPage";
import { SimplePage } from "./pages/SimplePage";
import { TodoListPage } from "./pages/TodoListPage";
import { SimpleTable } from "./tables/SimpleTable";

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
            <NavDropdown title="Agents">
              <NavLink to={"/ai/chat1"}>Weather Agent</NavLink>
              <NavLink to={"/ai/chat2"}>Chat (light)</NavLink>
            </NavDropdown>
            <NavDropdown title="Tables">
              <NavLink to="/simple-table" text="Simple Table" />
            </NavDropdown>
            <NavDropdown title="Pages">
              <NavLink to="/pages/simple" text="Simple" />
              <NavLink to="/pages/list-page" text="List Page" />
              <NavLink
                to="/pages/master-details"
                text="Master-Details (CRUD)"
              />
              <NavLink to="/pages/loading" text="Loading Page" />
              <NavLink to="/pages/message" text="Message Page" />
            </NavDropdown>
          </Nav>
        }
        publicRoutes={
          <>
            <Route index element={<WeatherAgentPage />} />
            <Route path="ai">
              <Route path="chat1" element={<WeatherAgentPage />} />
              <Route path="chat2" element={<ChatLight />} />
            </Route>

            <Route path="/simple-table" element={<SimpleTable />} />
            <Route path="/pages/simple" element={<SimplePage />} />
            <Route path="/pages/list-page" element={<TodoListPage />} />
            <Route
              path="/pages/master-details"
              element={<MasterDetailContainer />}
            >
              <Route index element={<MasterDetailListPage />} />
              <Route path=":id" element={<MasterDetailPage />} />
            </Route>

            <Route path="/pages/loading" element={<LoadingPage />} />
            <Route
              path="/pages/message"
              element={<MessagePage>This is a test message</MessagePage>}
            />
          </>
        }
      />
    </BrowserRouter>
  );
}
