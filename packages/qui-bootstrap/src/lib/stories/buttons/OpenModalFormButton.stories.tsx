import type { Meta, StoryObj } from "@storybook/react";

import { ModalContextProvider } from "@clickapp/qui-core";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { OpenModalFormButton } from "../../buttons/OpenModalFormButton";
import { ModalForm, ModalFormProps } from "../../modals";

import { CheckField, InputField, SelectField } from "../../forms";

const meta = {
  title: "clickapp/Buttons/OpenModalFormButton",
  component: OpenModalFormButton,
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
    label: "Open Form Modal",
    modal: TestModal as any,
    onSubmit: async (data: unknown) => {
      console.log(data);
    },
  },
} satisfies Meta<typeof OpenModalFormButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditModal: Story = {
  args: {},
};

function TestModal(
  props: ModalFormProps<{ firstName: string; lastName: string }>
) {
  return (
    <ModalForm {...props}>
      <Row>
        <Col>
          <InputField
            name="firstName"
            ops={{ required: "This field is required." }}
          />
        </Col>
        <Col>
          <InputField
            name="lastName"
            ops={{ required: "This field is required." }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <SelectField name="year" label="Year">
            <option value={`2024`}>2024</option>
            <option value={`2025`}>2025</option>
          </SelectField>
        </Col>
        <Col>
          <SelectField name="newsType" label="Typ">
            <option value="common">common</option>
            <option value="changes">changes</option>
          </SelectField>
        </Col>
      </Row>
      <Row>
        <Col>
          <InputField
            name="date"
            ops={{ required: "This field is required.", valueAsDate: true }}
            type="date"
            label="Date"
          />
        </Col>
        <Col>
          <InputField name="partner" />
        </Col>
      </Row>

      <InputField name="description" as="textarea" />

      <CheckField name="disabled" label="Disabled" />
    </ModalForm>
  );
}
