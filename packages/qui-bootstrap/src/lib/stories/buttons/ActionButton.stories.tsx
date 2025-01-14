import type { Meta, StoryObj } from "@storybook/react";

import { ActionButton } from "../../buttons/ActionButton";
import { ModalContextProvider } from "@clickapp/qui-core";
import React from "react";

const meta = {
  title: "clickapp/Buttons/ActionButton",
  component: ActionButton,
  tags: ["autodocs"],
  parameters: {
    // layout: "fullscreen",
  },

  decorators: [
    (Story) => (
      <ModalContextProvider>
        <Story />
      </ModalContextProvider>
    ),
  ],
  args: {
    disabled: false,
    hideLabelOnRunning: false,
    onClick: async () => {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },

    children: "Load data",
  },
} satisfies Meta<typeof ActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultButton: Story = {
  args: {},
};

export const SmallOutlinePrimaryButton: Story = {
  args: {
    size: "sm",
    variant: "outline-primary",
  },
};

export const HideLabelOnRunning: Story = {
  args: {
    size: "sm",
    variant: "outline-primary",
    hideLabelOnRunning: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: "outline-primary",
    disabled: true,
  },
};

export const ShowErrorMessageOnFail: Story = {
  args: {
    variant: "outline-primary",
    onClick: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error(
        "An error occurred. Please check your input and try again."
      );
    },
  },
};

export const ShowCustomErrorMessage: Story = {
  args: {
    variant: "outline-primary",
    onClick: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      throw new Error(
        "An error occurred. Please check your input and try again."
      );
    },
    errorTitle: "Custom Error Title",
    errorBody: (e) => (
      <>
        An error occurred.
        <br />
        Please try again later. If the issue persists, contact your
        administrator for assistance.
      </>
    ),
  },
};
