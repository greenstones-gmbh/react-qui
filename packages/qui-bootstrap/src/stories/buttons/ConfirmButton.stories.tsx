import type { Meta, StoryObj } from "@storybook/react";

import { ConfirmButton } from "../../buttons/ConfirmButton";
import { ModalContextProvider } from "@greenstones/qui-core";
import React from "react";

const meta = {
  title: "qui/Buttons/ConfirmButton",
  component: ConfirmButton,
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
    onClick: async () => {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },

    confirmTitle: "Confirm Deletion",
    confirmBody:
      "Are you sure you want to delete this item? This action cannot be undone.",
    confirmSubmitButtonLabel: "Delete",
    confirmSize: "lg",
    label: "Delete Item",
  },
} satisfies Meta<typeof ConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmDelete: Story = {
  args: {},
};
