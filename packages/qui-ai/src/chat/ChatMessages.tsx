import type {
  AssistantMessageItem,
  FunctionCallItem,
  FunctionCallResultItem,
  UnknownItem,
  UserMessageItem,
} from "@openai/agents";
import { Fragment, type ReactNode } from "react";
import type { MessageItem } from "./MessageItem";

export function ChatMessages({
  messages,
  className,
  renderUserMessage,
  renderAssistantMessage,
  renderFunctionCall,
}: {
  messages: MessageItem[];
  className: string;
  renderUserMessage: (message: UserMessageItem) => ReactNode;
  renderAssistantMessage: (message: AssistantMessageItem) => ReactNode;
  renderFunctionCall?: (
    call: FunctionCallItem,
    result?: FunctionCallResultItem,
  ) => ReactNode;
}) {
  const functionResultItems = messages
    .filter((m) => isFunctionCallResult(m))
    .reduce(
      (p, c) => {
        p[c.callId] = c;
        return p;
      },
      {} as Record<string, FunctionCallResultItem>,
    );

  function renderMessage(m: MessageItem) {
    if (isUserMessage(m)) {
      return renderUserMessage(m);
    }
    if (isAssistantMessage(m)) {
      return renderAssistantMessage(m);
    }

    if (isFunctionCall(m)) {
      return renderFunctionCall?.(m, functionResultItems[m.callId]);
    }

    return null;
  }

  return (
    <div className={className}>
      {messages.map((m, index) => (
        <Fragment key={index}>{renderMessage(m)}</Fragment>
      ))}
    </div>
  );
}

export const isUserMessage = (m: MessageItem): m is UserMessageItem => {
  return (m as UserMessageItem).role === "user";
};

export const isAssistantMessage = (
  m: MessageItem,
): m is AssistantMessageItem => {
  return (m as AssistantMessageItem).role === "assistant";
};

export const isFunctionCallResult = (
  m: MessageItem,
): m is FunctionCallResultItem => {
  return (m as FunctionCallResultItem).type === "function_call_result";
};

export const isFunctionCall = (m: MessageItem): m is FunctionCallItem => {
  return (m as FunctionCallItem).type === "function_call";
};

export const isUnknown = (m: MessageItem): m is UnknownItem => {
  return (m as UnknownItem).type === "unknown";
};
