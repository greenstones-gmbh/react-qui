import type { UserMessageItem } from "@openai/agents";
import { Fragment, type ReactNode } from "react";

export function UserMessage({
  message,
  renderContent = (content) => <div>{content}</div>,
}: {
  message: UserMessageItem;
  renderContent?: (content: string) => ReactNode;
}) {
  return getUserContent(message).map((content, index) => (
    <Fragment key={`c-${index}`}>{renderContent(content)}</Fragment>
  ));
}

function getUserContent(message: UserMessageItem) {
  let text;
  if (typeof message.content === "string") {
    text = [message.content];
  } else if (Array.isArray(message.content)) {
    return message.content
      .filter((m) => m.type === "input_text")
      .map((m) => m.text);
  } else {
    text = [JSON.stringify(message.content)];
  }
  return text;
}
