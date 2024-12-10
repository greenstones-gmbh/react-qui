import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "react-bootstrap";
import { withRouter } from "storybook-addon-remix-react-router";
import { AppLayout } from "../../app";
import { Page } from "../../pages";
import React from "react";

import {
  TestBreadcrumb,
  TestContent,
  TestNavbarBrand,
  TestSidebarNav,
  TestToolbar,
  TestTopNavbarNav,
} from "../TestComponents";

const meta = {
  title: "App/AppLayout",
  component: AppLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    heightRelativeToParent: true,
    sidenav: <TestSidebarNav />,
    brand: <TestNavbarBrand />,
    topnav: <TestTopNavbarNav />,
    topnavTheme: "light",
    topnavClassName: "bg-light",
    sidebarClassName: "bg-purple",
    sidebarTheme: "dark",

    children: (
      <Container className="my-2  d-flex flex-column ">
        <div className="bg-light rounded d-flex flex-fill justify-content-center align-items-center">
          main
        </div>
      </Container>
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
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TopnavStyle: Story = {
  name: "Style 'topnav'",
  args: {
    layout: "topnav",
    children: (
      <Page
        fluid={false}
        noInsets
        header="Header"
        children={<TestContent contentSize={4} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
  },
};

export const TopnavFluidStyle: Story = {
  name: "Style 'topnav-fluid'",
  args: {
    layout: "topnav-fluid",
    children: (
      <Page
        noInsets
        header="Header"
        children={<TestContent contentSize={4} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
  },
};

export const SidebarStyle: Story = {
  name: "Style 'sidebar'",
  args: {
    layout: "sidebar",
    children: (
      <Page
        header="Header"
        children={<TestContent contentSize={4} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
  },
};

export const SidebarStyle1: Story = {
  name: "Style 'sidebar', Dark",
  args: {
    layout: "sidebar",
    topnavTheme: "dark",
    topnavClassName: "bg-dark",
    sidebarClassName: "bg-light",
    sidebarTheme: "light",
    children: (
      <Page
        header="Header"
        children={<TestContent contentSize={4} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
  },
};

export const BrandSidebarStyle: Story = {
  name: "Style 'brand-sidebar'",
  args: {
    layout: "brand-sidebar",
    children: (
      <Page
        header="Header"
        children={<TestContent contentSize={4} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
  },
};

export const BrandSidebarStyle1: Story = {
  name: "Style 'brand-sidebar', Dark",
  args: {
    layout: "brand-sidebar",
    topnavTheme: "dark",
    topnavClassName: "bg-dark",
    sidebarClassName: "bg-light",
    sidebarTheme: "light",
    children: (
      <Page
        header="Header"
        children={<TestContent contentSize={4} />}
        footer="This is a footer"
        subheader={<TestToolbar />}
        breadcrumb={<TestBreadcrumb />}
        fillBody={true}
        scrollBody={true}
      />
    ),
  },
};
