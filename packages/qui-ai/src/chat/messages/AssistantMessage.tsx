import type { AssistantMessageItem, UserMessageItem } from "@openai/agents";
import { Fragment, type ReactNode } from "react";

export function AssistantMessage({
  message,
  renderContent = (content) => <div>{content}</div>,
}: {
  message: AssistantMessageItem;
  renderContent?: (content: string) => ReactNode;
}) {
  return getAssistantContent(message).map((content, index) => (
    <Fragment key={`c-${index}`}>{renderContent(content)}</Fragment>
  ));
}

function getAssistantContent(message: AssistantMessageItem) {
  let text;
  if (typeof message.content === "string") {
    text = [message.content];
  } else if (Array.isArray(message.content)) {
    return message.content
      .filter((m) => m.type === "output_text")
      .map((m) => m.text);
  } else {
    text = [JSON.stringify(message.content)];
  }
  return text;
}
