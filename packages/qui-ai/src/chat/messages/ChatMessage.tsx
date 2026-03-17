import type {
  AgentInputItem,
  AssistantMessageItem,
  FunctionCallItem,
  FunctionCallResultItem,
  UnknownItem,
  UserMessageItem,
} from "@openai/agents";
import { type PropsWithChildren } from "react";

import { MarkdownText } from "../../md/MarkdownText";

import { Info } from "lucide-react";

import { IconPopupTrigger } from "@greenstones/qui-bootstrap";
import { stringifyWithFormat } from "../../utils/stringify";
import { UserMessage } from "./UserMessage";

export const isUserMessage = (m: AgentInputItem): m is UserMessageItem => {
  return (m as UserMessageItem).role === "user";
};

const isAssistantMessage = (m: AgentInputItem): m is AssistantMessageItem => {
  return (m as AssistantMessageItem).role === "assistant";
};

const isFunctionCallResult = (
  m: AgentInputItem,
): m is FunctionCallResultItem => {
  return (m as FunctionCallResultItem).type === "function_call_result";
};

const isFunctionCall = (m: AgentInputItem): m is FunctionCallItem => {
  return (m as FunctionCallItem).type === "function_call";
};

const isUnknown = (m: AgentInputItem): m is UnknownItem => {
  return (m as UnknownItem).type === "unknown";
};

export function Message({
  message,
  chat,
}: {
  message: AgentInputItem;
  chat: any;
}) {
  if (isUserMessage(message)) {
    return <UserMessage message={message} />;
  }
  if (isAssistantMessage(message)) {
    return <AssistantMessage message={message} chat={chat} />;
  }

  if (isUnknown(message)) {
    return <UnknownMessage message={message} chat={chat} />;
  }
  if (isFunctionCallResult(message)) {
    return <FunctionCallResultMessage message={message} />;
  }
  if (isFunctionCall(message)) {
    return <FunctionCallMessage message={message} />;
  }
  //return <div className="border mb-3">{JSON.stringify(message)}</div>;
  return undefined;
}

function FunctionCallMessage({
  message,
}: PropsWithChildren<{ message: FunctionCallItem }>) {
  return (
    <div className="ms-4 mb-1 d-flex">
      <div className="bg-light py-1 px-3 rounded-2 small">
        Calling <code className="ms-2">{message.name}(...)</code>{" "}
        <IconPopupTrigger Icon={Info}>
          <div className="overflow-auto" style={{ maxHeight: 400 }}>
            <pre>{stringifyWithFormat(message)}</pre>
          </div>
        </IconPopupTrigger>
      </div>
    </div>
  );
}

function FunctionCallResultMessage({
  message,
}: PropsWithChildren<{ message: FunctionCallResultItem }>) {
  return (
    <div className=" ms-4 mb-1 d-flex">
      <div className="bg-light py-1 px-3 rounded-2 small">
        <code className="">{message.name}(...)</code> {message.status}.{" "}
        <IconPopupTrigger Icon={Info}>
          <div className="overflow-auto" style={{ maxHeight: 400 }}>
            <pre>{stringifyWithFormat(message)}</pre>
          </div>
        </IconPopupTrigger>
      </div>
    </div>
  );
}

function AssistantMessage({
  message,
  chat,
}: PropsWithChildren<{ message: AssistantMessageItem; chat: any }>) {
  let text = "";
  if (typeof message.content === "string") {
    text = message.content;
  } else if (Array.isArray(message.content)) {
    return message.content
      .filter((m) => m.type === "output_text")
      .map((m) => <MarkdownText text={m.text} chat={chat} />);
    //   text = (message.content[0] as any).content.text;
  } else {
    text = JSON.stringify(message.content);
  }
  return <MarkdownText text={text} chat={chat} />;
}

function UnknownMessage({
  message,
  chat,
}: PropsWithChildren<{ message: UnknownItem; chat: any }>) {
  const data = message.providerData;
  if (data.type === "error")
    return (
      <div className="">
        <div className="mb-3 bg-danger-subtle py-2 px-3 rounded-2 small overflow-auto">
          {data.message}
        </div>
      </div>
    );

  return JSON.stringify(message);
}
