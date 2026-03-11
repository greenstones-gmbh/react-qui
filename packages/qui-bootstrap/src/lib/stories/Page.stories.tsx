import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Badge, Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Page, PageHeader } from "../pages";

import { BsBox } from "react-icons/bs";
import { TestContent } from "./TestComponents";

const breadcrumb = (
  <Breadcrumb>
    <Breadcrumb.Item>Home</Breadcrumb.Item>
    <Breadcrumb.Item>Parteners</Breadcrumb.Item>
    <Breadcrumb.Item active>Greenstones GmbH</Breadcrumb.Item>
  </Breadcrumb>
);

const subheader = (
  <ButtonToolbar>
    <ButtonGroup size="sm">
      <Button variant="light">Edit</Button>
      <Button variant="light">Delete</Button>
    </ButtonGroup>
  </ButtonToolbar>
);

const meta = {
  title: "qui/Page",
  component: Page,
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    //"fullscreen"
    // layout: "padded",
    layout: "fullscreen",
  },
  args: {
    header: "Header",
    children:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    footer: "This is a footer",
    fillBody: true,
    scrollBody: true,
  },
  decorators: [
    (Story) => (
      <div
        className="d-flex flex-column flex-fill border-bottom"
        style={{ height: 400 }}
      >
        <div
          className="d-flex flex-row flex-fill flex-shrink-1"
          style={{ minHeight: 0 }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    fillBody: false,
    breadcrumb,
    subheader,
  },
};

export const FillParentContainer: Story = {
  args: {
    fillBody: true,
    breadcrumb,
    subheader,
  },
};

export const NoInsets: Story = {
  args: {
    fillBody: true,
    breadcrumb,
    subheader,
    noInsets: true,
  },
};

export const CustomInsets: Story = {
  args: {
    fillBody: true,
    breadcrumb,
    subheader,
    insets: "p-5",
    className: "bg-light",
  },
};

export const ScrollBody: Story = {
  args: {
    fillBody: true,
    scrollBody: true,
    breadcrumb,
    subheader,
    children: <TestContent contentSize={8} />,
  },
};

export const CustomHeader: Story = {
  args: {
    header: (
      <PageHeader addon={<Badge bg="warning">WARN</Badge>}>
        <BsBox className="me-2" /> Header
      </PageHeader>
    ),
    breadcrumb: (
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Parteners</Breadcrumb.Item>
        <Breadcrumb.Item active>Greenstones GmbH</Breadcrumb.Item>
      </Breadcrumb>
    ),
  },
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing
// export const LoggedIn: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const loginButton = canvas.getByRole("button", { name: /Log in/i });
//     await expect(loginButton).toBeInTheDocument();
//     await userEvent.click(loginButton);
//     await expect(loginButton).not.toBeInTheDocument();

//     const logoutButton = canvas.getByRole("button", { name: /Log out/i });
//     await expect(logoutButton).toBeInTheDocument();
//   },
// };
