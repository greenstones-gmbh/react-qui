import {
  Breadcrumb,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Nav,
} from "react-bootstrap";
import {
  Bs1Circle,
  BsArrowUpRightCircle,
  BsBox,
  BsCalendar,
  BsDatabase,
  BsHouse,
} from "react-icons/bs";
import { Page } from "../pages/Page";

import { NavbarBrand } from "../app/BrandSidebarLayout";
import CollapseNav from "../nav/CollapseNav";
import { NavLink } from "../nav/NavLink";
import "./test.css";

export function TestBreadcrumb() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>Parteners</Breadcrumb.Item>
      <Breadcrumb.Item active>Greenstones GmbH</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export function TestToolbar() {
  return (
    <ButtonToolbar>
      <ButtonGroup size="sm">
        <Button variant="light">Edit</Button>
        <Button variant="light">Delete</Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
}

export function TestPage({ contentSize = 1 }: any) {
  return (
    <Page
      header="Header"
      footer="This is a footer"
      subheader={<TestToolbar />}
      breadcrumb={<TestBreadcrumb />}
      fillBody={true}
      scrollBody={true}
    >
      <TestContent contentSize={contentSize} />
    </Page>
  );
}

// export function TestNavbar({
//   theme,
//   fluid = false,
//   containerClassName,
//   className = "bg-light",
//   hideBrand,
// }: {
//   theme?: string;
//   fluid?: boolean;
//   containerClassName?: string;
//   hideBrand?: boolean;
//   className?: string;
// }) {
//   return (
//     <TopNavbar
//       theme={theme}
//       fluid={fluid}
//       containerClassName={containerClassName}
//       brand={!hideBrand ? <TestNavbarBrand /> : undefined}
//     >
//       <Nav className="me-auto">
//         <NavLink to={"/cells"}>Projects1</NavLink>
//         <NavLink to="/">Partners</NavLink>
//       </Nav>
//     </TopNavbar>
//   );
// }

// export function TestNavbar1({
//   theme,
//   fluid = false,
//   containerClassName,
//   className = "bg-light",
//   hideBrand,
// }: {
//   theme?: string;
//   fluid?: boolean;
//   containerClassName?: string;
//   hideBrand?: boolean;
//   className?: string;
// }) {
//   return (
//     <Navbar expand="md" className={className} data-bs-theme={theme}>
//       <Container fluid={fluid} className={containerClassName}>
//         {!hideBrand && (
//           <Navbar.Brand href="#home" className="mx-2 text-white1 fw-semibold">
//             <BsBox size={32} className="me-3" />
//             clickapp
//           </Navbar.Brand>
//         )}
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link>Projects</Nav.Link>
//             <Nav.Link active>Partners</Nav.Link>
//           </Nav>

//           {/* <Nav className="ms-auto">
//             <Button variant="outline-primary" size="sm" className="ms-2">
//               SignIn
//             </Button>
//           </Nav> */}
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

export function TestContent({ contentSize = 1 }: any) {
  return (
    <>
      {Array(contentSize)
        .fill(0)
        .map((_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </p>
        ))}
    </>
  );
}

export function TestSidebarNav() {
  return (
    <ul className="nav nav-pills flex-column mt-3 mb-auto">
      <li className="nav-item">
        <a href="#" className="nav-link active" aria-current="page">
          <BsHouse className="me-3" style={{ marginTop: -2 }} />
          Home
        </a>
      </li>
      <li>
        <a href="#" className="nav-link link-body-emphasis">
          <BsCalendar className="me-3" />
          Dashboard
        </a>
      </li>
      <li>
        <a href="#" className="nav-link link-body-emphasis">
          <Bs1Circle className="me-3" />
          Orders
        </a>
      </li>
      <li>
        <a href="#" className="nav-link link-body-emphasis">
          <BsDatabase className="me-3" />
          Products
        </a>
      </li>
      <li>
        <a href="#" className="nav-link link-body-emphasis">
          <BsArrowUpRightCircle className="me-3" />
          Customers
        </a>
      </li>
    </ul>
  );
}

export function TestNavbarBrand() {
  return <NavbarBrand name="clickapp" icon={BsBox} className="ms-0" />;
}

export function TestCollapseNav() {
  return (
    <>
      <CollapseNav className="mt-3" label="Home" expanded={true}>
        <CollapseNav.Item to="/">Overview</CollapseNav.Item>
        <CollapseNav.Item to="/">Updates</CollapseNav.Item>
        <CollapseNav.Item to="/ltes">Reports</CollapseNav.Item>
      </CollapseNav>

      <CollapseNav className="mt-4" label="Dashboard" expanded={true}>
        <CollapseNav.Item to="/">Overview</CollapseNav.Item>
        <CollapseNav.Item to="/">Weekly</CollapseNav.Item>
        <CollapseNav.Item to="/">Monthly</CollapseNav.Item>
      </CollapseNav>
    </>
  );
}

export function TestTopNavbarNav() {
  return (
    <Nav className="me-auto">
      <NavLink to={"/cells"}>Projects</NavLink>
      <NavLink to="/">Partners</NavLink>
    </Nav>
  );
}
