import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "react-bootstrap";
import { withRouter } from "storybook-addon-remix-react-router";
import { BrandSidebarLayout } from "../../app/BrandSidebarLayout";
import { SidebarLayout } from "../../app/SidebarLayout";

import { TopNavbar } from "../../navbar/TopNavbar";
import { Page } from "../../pages/Page";
import {
  TestBreadcrumb,
  TestCollapseNav,
  TestContent,
  TestNavbarBrand,
  TestSidebarNav,
  TestToolbar,
  TestTopNavbarNav,
} from "../TestComponents";
import { Sidebar } from "../../app/Sidebar";

const meta = {
  title: "App/SidebarLayout",
  component: SidebarLayout,
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

export const WithPage: Story = {
  name: "Page",
  args: {
    top: (
      <TopNavbar brand={<TestNavbarBrand />} className="shadow-sm">
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    children: (
      <Page
        header="Header"
        children={<TestContent contentSize={8} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
    sidebar: (
      <Sidebar className="bg-sidebar" theme="dark" width={200}>
        <TestSidebarNav />
      </Sidebar>
    ),
  },
};

export const CenteredPage: Story = {
  args: {
    top: (
      <TopNavbar brand={<TestNavbarBrand />} className="shadow-sm">
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    children: (
      <Page
        fluid={false}
        header="Header"
        children={<TestContent contentSize={8} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
    sidebar: (
      <Sidebar className="bg-sidebar" theme="dark" width={200}>
        <TestSidebarNav />
      </Sidebar>
    ),
  },
};

export const CenterAllPages: Story = {
  args: {
    fluidContent: false,
    top: (
      <TopNavbar brand={<TestNavbarBrand />} className="shadow-sm">
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    children: (
      <Page
        header="Header"
        children={<TestContent contentSize={8} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
    sidebar: (
      <Sidebar className="bg-sidebar" theme="dark" width={200}>
        <TestSidebarNav />
      </Sidebar>
    ),
  },
};

export const LightSidebar: Story = {
  args: {
    top: (
      <TopNavbar
        fluid
        className="border-bottom bg-light"
        brand={<TestNavbarBrand />}
      >
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    sidebar: (
      <Sidebar className="bg-white border-end" theme="light" width={200}>
        <TestSidebarNav />
      </Sidebar>
    ),
  },
};

export const LightSidebar1: Story = {
  args: {
    top: (
      <TopNavbar
        fluid
        theme="dark"
        className="border-bottom bg-dark"
        brand={<TestNavbarBrand />}
      >
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    sidebar: (
      <Sidebar className="bg-white border-end" theme="light" width={200}>
        <TestSidebarNav />
      </Sidebar>
    ),
  },
};

export const LightSidebar2: Story = {
  args: {
    top: (
      <TopNavbar
        fluid
        className="border-bottom bg-white"
        brand={<TestNavbarBrand />}
      >
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    sidebar: (
      <Sidebar className="bg-white border-end" theme="light" width={200}>
        <TestSidebarNav />
      </Sidebar>
    ),
  },
};

export const DarkSidebar: Story = {
  args: {
    top: (
      <TopNavbar
        fluid
        className="bg-primary"
        theme="dark"
        brand={<TestNavbarBrand />}
      >
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    sidebar: (
      <Sidebar className="bg-dark" theme="dark" width={200}>
        <TestSidebarNav />
      </Sidebar>
    ),
  },
};

export const CustomSidebar: Story = {
  args: {
    top: (
      <TopNavbar fluid brand={<TestNavbarBrand />}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),

    children: (
      <Container className="my-2  d-flex flex-column ">
        <div className="bg-light rounded flex-fill p-4">
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
      <Sidebar className="bg-sidebar" theme="dark" width={200}>
        <TestSidebarNav />
      </Sidebar>
    ),
  },
};

export const LightWithCollapseNav: Story = {
  args: {
    top: (
      <TopNavbar
        fluid
        brand={<TestNavbarBrand />}
        className="border-bottom bg-light"
      >
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    sidebar: (
      <Sidebar className="bg-white border-end" theme="light" width={200}>
        <TestCollapseNav />
      </Sidebar>
    ),
  },
};

export const DarkWithCollapseNav: Story = {
  args: {
    top: (
      <TopNavbar
        fluid
        brand={<TestNavbarBrand />}
        className="border-bottom bg-light"
      >
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    sidebar: (
      <Sidebar className="bg-dark" theme="dark" width={200}>
        <TestCollapseNav />
      </Sidebar>
    ),
  },
};

export const CustomWithCollapseNav: Story = {
  args: {
    top: (
      <TopNavbar
        fluid
        brand={<TestNavbarBrand />}
        className="border-bottom bg-light"
      >
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    sidebar: (
      <Sidebar className="bg-sidebar" theme="dark" width={200}>
        <TestCollapseNav />
      </Sidebar>
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
