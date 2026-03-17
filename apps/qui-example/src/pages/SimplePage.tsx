import { Page } from "@greenstones/qui-bootstrap";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";

export function SimplePage() {
  return (
    <Page
      header="Simple Page"
      headerLead="This is a simple page"
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Pages
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Simple</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      <p>
        Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam
        varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus
        magna felis sollicitudin mauris. Integer in mauris eu nibh euismod
        gravida.
      </p>
      <p>
        Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet
        sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis
        velit, rhoncus eu, luctus et interdum adipiscing wisi.
      </p>
    </Page>
  );
}
