// import {
//   AppLayout,
//   AuthNavbarButtons,
//   LayoutSwitcherDropdown,
//   NavbarBrand,
//   NavLink,
//   Page,
//   SidebarLayout,
//   TopNavbar,
// } from "@greenstones/qui-bootstrap";

import {
  AppLayout,
  LayoutSwitcherDropdown,
  NavbarAuthButtons,
  NavbarBrand,
  NavLink,
  Page,
  SignInPage,
} from "@greenstones/qui-bootstrap";
import { AppRoutes } from "@greenstones/qui-core";
//import "@greenstones/qui-core/dist/style.css";
import { Breadcrumb, Nav } from "react-bootstrap";
import { BsHouse } from "react-icons/bs";
import { PiGraphBold } from "react-icons/pi";
import { BrowserRouter, Route } from "react-router-dom";

function Home() {
  return (
    <Page
      header="Home Page"
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Parteners</Breadcrumb.Item>
          <Breadcrumb.Item active>Greenstones GmbH</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      aslkdjalskdals
      <br />
    </Page>
  );
}

function Test() {
  return (
    <Page
      header="Test Page"
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Parteners</Breadcrumb.Item>
          <Breadcrumb.Item active>Greenstones GmbH</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      aslkdjalskdals
    </Page>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes
        layout={<AppLayout1 />}
        public={
          <>
            <Route index element={<Home />} />
            <Route path="test" element={<Test />} />
            <Route path="login1" element={<SignInPage />} />
          </>
        }
      />
    </BrowserRouter>
  );
}
function AppLayout1() {
  return (
    <AppLayout
      layout="topnav"
      brand={<NavbarBrand name="MyApp" icon={PiGraphBold} />}
      topnav={
        <>
          <Nav className="me-auto">
            <NavLink to="/login1">Home</NavLink>
            <NavLink to="/features">Features</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
          </Nav>

          <LayoutSwitcherDropdown />
          <NavbarAuthButtons variant="outline-primary" />
        </>
      }
      sidenav={
        <>
          <Nav variant="pills" className="flex-column mt-3">
            <NavLink to="/">
              <BsHouse className="me-3" style={{ marginTop: -2 }} />
              Home
            </NavLink>
            <NavLink to="/test">
              <BsHouse className="me-3" style={{ marginTop: -2 }} />
              Projects
            </NavLink>
          </Nav>
        </>
      }
      sidebarClassName="bg-dark"
      sidebarTheme="light"
    />
  );
}

export default App;
