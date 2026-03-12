import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Container } from "react-bootstrap";
import { withRouter } from "storybook-addon-remix-react-router";
import { TopNavLayout } from "../../app/TopNavLayout";
import { TopNavbar } from "../../navbar/TopNavbar";
import { Page } from "../../pages/Page";
import {
  TestBreadcrumb,
  TestContent,
  TestNavbarBrand,
  TestToolbar,
  TestTopNavbarNav,
} from "../TestComponents";

const page = (
  <Page
    header="Header"
    children={<TestContent contentSize={4} />}
    footer="This is a footer"
    subheader={<TestToolbar />}
    breadcrumb={<TestBreadcrumb />}
    fillBody={true}
    scrollBody={true}
  />
);

const meta = {
  title: "App/TopNavLayout",
  component: TopNavLayout,
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
} satisfies Meta<typeof TopNavLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPage: Story = {
  name: "Page",
  args: {
    children: page,
    top: (
      <TopNavbar brand={<TestNavbarBrand />}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
  },
};

export const WithPageFullWidth: Story = {
  name: "Page (full width)",
  args: {
    fluid: true,
    children: page,
    top: (
      <TopNavbar brand={<TestNavbarBrand />}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
  },
};

export const LightNavbar: Story = {
  args: {
    top: (
      <TopNavbar brand={<TestNavbarBrand />}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
  },
};

export const DarkNavbar: Story = {
  args: {
    top: (
      <TopNavbar className="bg-dark" theme="dark" brand={<TestNavbarBrand />}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
  },
};

export const CustomNavbar: Story = {
  args: {
    top: (
      <TopNavbar className="bg-purple" theme="dark" brand={<TestNavbarBrand />}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
  },
};

export const NavbarFluid: Story = {
  name: "Navbar (full width)",
  args: {
    top: (
      <TopNavbar fluid={true} containerClassName="" brand={<TestNavbarBrand />}>
        <TestTopNavbarNav />
      </TopNavbar>
    ),
    children: (
      <Container fluid className="my-2  d-flex flex-column ">
        <div className="bg-light rounded d-flex flex-fill justify-content-center align-items-center">
          main
        </div>
      </Container>
    ),
  },
};

export const Simple: Story = {
  args: {},
};

export const Fluid: Story = {
  name: "Fluid (full width)",
  args: {
    children: (
      <Container fluid className="my-2  d-flex flex-column ">
        <div className="bg-light rounded d-flex flex-fill justify-content-center align-items-center">
          main
        </div>
      </Container>
    ),
  },
};
