import { Page, type PageOptions } from "@greenstones/qui-bootstrap";
import { ChatPanel, EmptyPlaceholder, type ChatPanelProps } from "./ChatPanel";

export function ChatPage({
  chat,
  empty = <EmptyPlaceholder />,
  tools,
  variant,
  formClassName,
  userMessagePosition,
  userMessageClassName,
  children,
  ...pageOptions
}: ChatPanelProps & PageOptions) {
  return (
    <Page {...pageOptions} scrollBody={false}>
      <ChatPanel
        {...{
          chat,
          userMessagePosition,
          userMessageClassName,
          empty,
          formClassName,
          tools,
          variant,
        }}
      />
      {children}
    </Page>
  );
}
