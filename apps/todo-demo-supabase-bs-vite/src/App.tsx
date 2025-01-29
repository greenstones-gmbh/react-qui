// import {
//   AppLayout,
//   AuthNavbarButtons,
//   LayoutSwitcherDropdown,
//   NavbarBrand,
//   NavLink,
//   Page,
//   SidebarLayout,
//   TopNavbar,
// } from "@clickapp/qui-bootstrap";

import { BootstrapApp, NavLink } from "@clickapp/qui-bootstrap";
import "@clickapp/qui-bootstrap/dist/style.css";
import { Supabase } from "@clickapp/qui-supabase";
import { createClient } from "@supabase/supabase-js";
import { Nav } from "react-bootstrap";
import { BsBook } from "react-icons/bs";
import { BrowserRouter, Route } from "react-router-dom";
import { Database } from "./todos/database.types";
import { TodoList } from "./todos/TodoList";
import {
  TodoMasterDetailContainer,
  TodoMasterDetailListPage,
  TodoMasterDetailPage,
} from "./todos/TodoMasterDetailList";

const supabaseClient = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_SERVICE_ANON_KEY!
);

function App() {
  return (
    <BrowserRouter>
      <Supabase client={supabaseClient}>
        <BootstrapApp
          projectName="Todos with Supabase"
          icon={BsBook}
          hideLayoutSwitcher={false}
          topnav={
            <Nav>
              <NavLink to="/" text="Simple" />
              <NavLink to="/todos" text="Master-Detail" />
            </Nav>
          }
          publicRoutes={
            <>
              <Route index element={<TodoList />} />

              <Route path="todos" element={<TodoMasterDetailContainer />}>
                <Route index element={<TodoMasterDetailListPage />} />
                <Route path=":id" element={<TodoMasterDetailPage />} />
              </Route>
            </>
          }
        />
      </Supabase>
    </BrowserRouter>
  );
}

export default App;
