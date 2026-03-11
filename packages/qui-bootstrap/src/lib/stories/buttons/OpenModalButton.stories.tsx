import type { Meta, StoryObj } from "@storybook/react";

import { OpenModalButton } from "../../buttons/OpenModalButton";
import { ModalContextProvider } from "@greenstones/qui-core";
import React from "react";
import { MessageModal } from "../../modals";

const meta = {
  title: "qui/Buttons/OpenModalButton",
  component: OpenModalButton,
  tags: ["autodocs"],
  parameters: {
    // layout: "fullscreen",
    //layout: "center",
  },

  decorators: [
    (Story) => (
      <ModalContextProvider>
        <Story />
      </ModalContextProvider>
    ),
  ],
  args: {
    label: "Open Message Modal",
    modal: (close) => (
      <MessageModal
        handleClose={close}
        title="Message"
        children="This is an example message"
      />
    ),
  },
} satisfies Meta<typeof OpenModalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultButton: Story = {
  args: {},
};
