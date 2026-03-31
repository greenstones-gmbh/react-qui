import classNames from "classnames";
import type { ReactNode } from "react";
import { Spinner } from "react-bootstrap";
import { BootstrapStylesComponents } from "../md/BootstrapStyles";
import { MarkdownContent } from "../md/MarkdownContent";
import { ChatForm } from "./ChatForm";
import { ChatMessages } from "./ChatMessages";
import { AssistantMessage } from "./messages/AssistantMessage";
import {
  FunctionCall,
  FunctionCalls,
  type FunctionCallProps,
} from "./messages/FunctionCall";
import { UserMessage } from "./messages/UserMessage";
import { MessageContent } from "./TextContent";
import type { Chat } from "./use-chat";

export interface ChatPanelProps {
  chat: Chat;
  empty?: ReactNode;
  tools?: ReactNode;
  variant?: undefined | "bordered" | "standard";
  formClassName?: string;
  userMessagePosition?: undefined | "start" | "end";
  userMessageClassName?: string;
  centerOnEmpty?: boolean;
  chatMessagesClassName?: string;
}

export function ChatPanel({
  chat,
  userMessagePosition,
  userMessageClassName,
  empty,
  formClassName,
  tools,
  variant,
  centerOnEmpty = true,
  chatMessagesClassName = "gap-3",
}: ChatPanelProps) {
  const isEmptyChat = !chat.messages || chat.messages.length === 0;
  return (
    <div className="flex-fill d-flex flex-column" style={{ height: 1 }}>
      {!isEmptyChat && (
        <div className="overflow-auto d-flex flex-column flex-fill">
          <ChatMessages
            className={classNames("d-flex flex-column", chatMessagesClassName)}
            messages={chat.messages}
            renderUserMessage={(message) => (
              <UserMessage
                message={message}
                renderContent={(c) => (
                  <MessageContent
                    content={c}
                    wrapperClassName={classNames("d-flex", {
                      "justify-content-end": userMessagePosition === "end",
                    })}
                    className={
                      userMessageClassName || "bg-light py-3 px-3 rounded-4 "
                    }
                  />
                )}
              />
            )}
            renderAssistantMessage={(message) => (
              <AssistantMessage
                message={message}
                renderContent={(c) => (
                  <MarkdownContent
                    content={c}
                    wrapperClassName=""
                    components={{
                      ...BootstrapStylesComponents,
                      ...chat.widgets,
                    }}
                  />
                )}
              />
            )}
            renderFunctionCall={(call, result) => (
              <FunctionCalls
                call={call}
                result={result}
                defaultFunctionCalls={chat.defaultFunctionCall}
                functionCalls={chat.functionCalls}
              />
              // <FunctionCall {...{ call, result }} />
            )}
          />

          {chat.isRunning && (
            <Spinner
              className="ms-2 mt-3"
              animation="grow"
              variant="secondary"
              size="sm"
            />
          )}
          <div
            ref={chat.endRef}
            style={{ height: "10rem", minHeight: "10rem" }}
          >
            {" "}
          </div>
        </div>
      )}

      {isEmptyChat && !centerOnEmpty && empty && (
        <div className="flex-fill1 my-auto">{empty}</div>
      )}

      <div
        className={classNames("", {
          " my-auto ": centerOnEmpty && isEmptyChat,
        })}
      >
        {isEmptyChat && centerOnEmpty && empty}
        <ChatForm
          chat={chat}
          className={formClassName}
          tools={tools}
          examples={chat.examples}
          variant={variant}
        />
        {centerOnEmpty && isEmptyChat && (
          <div style={{ height: "20rem" }}></div>
        )}
      </div>
    </div>
  );
}

export function EmptyPlaceholder({ className }: { className?: string }) {
  return (
    <div>
      <div className={classNames("h4 fw-normal text-center mb-4", className)}>
        How can I help you today?
      </div>
    </div>
  );
}
