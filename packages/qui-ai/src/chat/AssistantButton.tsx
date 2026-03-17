import { Bot, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button, Offcanvas, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ChatPanel, EmptyPlaceholder } from "./ChatPanel";
import { type Chat } from "./use-chat";

export const AssistantButton = ({
  chat,
  type = "window",
}: {
  chat: Chat;
  type?: "window" | "offcanvas";
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  return (
    <div>
      <div style={{ position: "absolute", bottom: "1.2rem", right: "1.2rem" }}>
        <OverlayTrigger
          overlay={<Tooltip>Open Assistant</Tooltip>}
          placement="left"
        >
          <Button
            variant="primary"
            onClick={(e) => {
              setShow((s) => !s);
            }}
            style={{ borderRadius: 32, padding: 12 }}
          >
            {!show ? (
              <Bot width={24} height={24} />
            ) : (
              <ChevronDown width={24} height={24} />
            )}
          </Button>
        </OverlayTrigger>
      </div>

      {type === "offcanvas" && (
        <Offcanvas
          show={show}
          onHide={handleClose}
          placement="end"
          scroll={true}
          backdrop={false}
          className="shadow"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Assistant</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="flex-fill d-flex flex-column">
            <ChatPanel
              chat={chat}
              examples={[
                "What’s the weather like in Frankfurt?",
                "Create a table listing the current weather in the 5 largest German cities",
              ]}
              userMessagePosition="end"
              centerOnEmpty={false}
              chatMessagesClassName="gap-1"
              empty={<EmptyPlaceholder className="text-secondary" />}
            />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {type === "window" && show && (
        <div
          className="bg-white shadow-lg border rounded-4 p-3 d-flex flex-column"
          style={{
            height: "50%",
            minHeight: 600,
            position: "absolute",
            bottom: "5.4rem",
            right: "1.2rem",
            width: "28rem",
          }}
        >
          <ChatPanel
            chat={chat}
            examples={[
              "What’s the weather like in Frankfurt?",
              "Create a table listing the current weather in the 5 largest German cities",
            ]}
            userMessagePosition="end"
            centerOnEmpty={false}
            chatMessagesClassName="gap-1"
            empty={<EmptyPlaceholder className="text-secondary" />}
          />
        </div>
      )}
    </div>
  );
};
