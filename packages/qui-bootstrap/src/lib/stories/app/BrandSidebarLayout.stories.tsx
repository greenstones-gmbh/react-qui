import type { Meta, StoryObj } from "@storybook/react";
import { withRouter } from "storybook-addon-remix-react-router";
import { BrandSidebar, BrandSidebarLayout } from "../../app";

import { TopNavbar } from "../../navbar/TopNavbar";
import {
  TestBreadcrumb,
  TestCollapseNav,
  TestContent,
  TestNavbarBrand,
  TestPage,
  TestSidebarNav,
  TestToolbar,
  TestTopNavbarNav,
} from "../TestComponents";
import { Page } from "../../pages";
import { Container } from "react-bootstrap";
import { Sidebar } from "../../app/Sidebar";
import React from "react";

const meta = {
  title: "App/BrandSidebarLayout",
  component: BrandSidebarLayout,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    //"fullscreen"
    layout: "fullscreen",
  },
  args: {
    heightRelativeToParent: true,
    top: (
      <div className="d-flex flex-fill bg-secondary p-2 text-white justify-content-center align-items-center">
        top
      </div>
    ),
    children: (
      <Container fluid className="my-2 d-flex flex-column ">
        <div className="bg-light rounded d-flex flex-fill justify-content-center align-items-center">
          main
        </div>
      </Container>
    ),
    sidebar: (
      <Sidebar
        width={200}
        className="d-flex  bg-primary justify-content-center align-items-center"
      >
        sidebar
      </Sidebar>
    ),
  },
  decorators: [
    withRouter,
    (Story) => (
      <div
        className="d-flex flex-column flex-fill border-bottom"
        style={{ height: 400 }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BrandSidebarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomSidebarWithPage: Story = {
  name: "Page",
  args: {
    top: (
      <TopNavbar>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    children: <TestPage />,
    sidebar: (
      <BrandSidebar
        className="bg-sidebar"
        theme="dark"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const CenteredPage: Story = {
  args: {
    top: (
      <TopNavbar>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    children: (
      <Page
        fluid={false}
        header="Header"
        children={<TestContent contentSize={6} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
    sidebar: (
      <BrandSidebar
        className="bg-sidebar"
        theme="dark"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const CenterAllPages: Story = {
  args: {
    fluidContent: false,
    top: (
      <TopNavbar>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    children: (
      <Page
        header="Header"
        children={<TestContent contentSize={6} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
    sidebar: (
      <BrandSidebar
        className="bg-sidebar"
        theme="dark"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const LightSidebar: Story = {
  args: {
    top: (
      <TopNavbar containerClassName={"mx-2"} className="border-bottom bg-light">
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    sidebar: (
      <BrandSidebar
        className="bg-white border-end"
        theme="light"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const LightSidebar1: Story = {
  args: {
    top: (
      <TopNavbar containerClassName={"mx-2"} className="border-bottom bg-white">
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    sidebar: (
      <BrandSidebar
        className="bg-light border-end"
        theme="light"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const LightSidebar2: Story = {
  args: {
    top: (
      <TopNavbar containerClassName={"mx-2"} className="border-bottom bg-white">
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    sidebar: (
      <BrandSidebar
        className="bg-white border-end"
        theme="light"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const DarkSidebar: Story = {
  args: {
    top: (
      <TopNavbar containerClassName={"mx-2"}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    sidebar: (
      <BrandSidebar
        className="bg-dark"
        theme="dark"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const MixedSidebar: Story = {
  args: {
    top: undefined,

    sidebar: (
      <BrandSidebar
        className="bg-light border-end"
        theme="light"
        navbarClassName="bg-dark"
        navbarTheme="dark"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const CustomSidebar: Story = {
  args: {
    top: (
      <TopNavbar containerClassName={"mx-2"}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    children: (
      <Container fluid className="my-2 d-flex flex-column ">
        <div className="bg-light rounded p-4 flex-fill ">
          <p>Add css classes:</p>
          <pre>{`
.bg-sidebar {
  background-color: #5046e6;
}

.bg-sidebar .nav-pills .nav-link.active {
  --bs-nav-pills-link-active-bg: #4338ca;
}
        `}</pre>
        </div>
      </Container>
    ),
    sidebar: (
      <BrandSidebar
        className="bg-sidebar"
        theme="dark"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestSidebarNav />
      </BrandSidebar>
    ),
  },
};

export const LightWithCollapseNav: Story = {
  args: {
    top: (
      <TopNavbar containerClassName={"mx-2"} className="border-bottom bg-light">
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    sidebar: (
      <BrandSidebar
        className="bg-white border-end"
        theme="light"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestCollapseNav />
      </BrandSidebar>
    ),
  },
};

export const DarkWithCollapseNav: Story = {
  args: {
    top: (
      <TopNavbar containerClassName={"mx-2"} className="border-bottom bg-light">
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    sidebar: (
      <BrandSidebar
        className="bg-dark"
        theme="dark"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestCollapseNav />
      </BrandSidebar>
    ),
  },
};

export const CustomWithCollapseNav: Story = {
  args: {
    heightRelativeToParent: true,
    top: (
      <TopNavbar containerClassName={"mx-2"} className="border-bottom bg-light">
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    sidebar: (
      <BrandSidebar
        className="bg-sidebar"
        theme="dark"
        width={200}
        brand={<TestNavbarBrand />}
      >
        <TestCollapseNav />
      </BrandSidebar>
    ),
  },
};

export const Simple: Story = {
  name: "Simple (default margins)",
  args: {
    sidebar: (
      <div
        className="d-flex bg-primary justify-content-center align-items-center"
        style={{ width: 200 }}
      >
        sidebar
      </div>
    ),
  },
};

export const NoTopNavbar: Story = {
  args: {
    top: undefined,
  },
};
