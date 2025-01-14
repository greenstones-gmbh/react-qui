import type { Meta, StoryObj } from "@storybook/react";

import { MessageModal } from "../../modals/MessageModal";

const meta = {
  title: "clickapp/Modals",
  component: MessageModal,
  tags: ["autodocs"],
  parameters: {
    // layout: "fullscreen",
  },
  args: {
    handleClose: () => {},
    title: "Update Successful",
    children:
      "Your changes have been saved successfully. You can continue working or close this window.",
    closeButtonLabel: "Close",
    size: "sm",
  },
} satisfies Meta<typeof MessageModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MessageModalStory: Story = {
  name: "Message Modal",
  args: {
    size: "sm",
  },
};
