import classNames from "classnames";
import { ArrowUp, Loader, Trash, WandSparkles } from "lucide-react";
import { useRef, type ReactNode, type Ref } from "react";
import { Button, ButtonToolbar, Dropdown, Form } from "react-bootstrap";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Chat } from "./use-chat";
import "./ChatForm.css";

export interface ChatFormProps {
  chat: Chat;
  className?: string;
  tools?: ReactNode;
  examples?: string[];
  variant?: undefined | "bordered" | "standard";
}

export function ChatForm({
  chat,
  examples,
  tools,
  className,
  variant,
}: ChatFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { register, handleSubmit, setValue } = useForm<{ message: string }>({
    defaultValues: { message: "" },
  });

  const field = register("message", { required: true });
  const onSubmit: SubmitHandler<any> = async (data) => {
    const msg = data.message;
    if (msg) {
      chat.callChat(msg, {
        monitor: (state: string) => {
          if (state === "start") {
            inputRef.current!.value = "";
          }
        },
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!chat.isRunning) formRef.current?.requestSubmit();
    }
  };

  let variantProps;
  switch (variant) {
    case "bordered":
      variantProps = {
        mainClassName: "border rounded-4 px-3 py-3 mb-3 shadow-sm",
        inputStyle: {
          border: "none",
          borderRadius: 0,
          padding: 0,
          minHeight: "auto",
          boxShadow: "none",
          background: "none",
          marginTop: ".375rem",
        },
        rows: 1,
      };
      break;

    default:
      variantProps = {
        mainClassName: "mt-1",
        inputStyle: undefined,
        rows: 2,
        //minHeight: "1rem",
      };
      break;
  }

  return (
    <div className={classNames(variantProps.mainClassName, className)}>
      <form
        className="d-grid gap-2"
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="px-0">
          <Form.Group className="" controlId="message">
            <Form.Control
              style={variantProps.inputStyle}
              as="textarea"
              {...{
                ...field,
                ref: ((r: Ref<HTMLTextAreaElement>) => {
                  field.ref?.(r);
                  inputRef.current = r as any;
                  return;
                }) as any,
              }}
              autoFocus
              rows={variantProps.rows}
              onKeyDown={handleKeyDown}
              onInput={autoresize(inputRef)}
              // placeholder={
              //   history.length > 0
              //     ? "Type your message or use ↑/↓ to browse input history"
              //     : "Type your message..."
              // }
              placeholder={"Type your message..."}
            />
          </Form.Group>
        </div>

        <ButtonToolbar className="gap-2">
          <Dropdown className="">
            <Dropdown.Toggle variant="light" size="sm">
              <WandSparkles size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {examples?.map((c) => (
                <Dropdown.Item
                  key={c}
                  onClick={() => {
                    setValue("message", c);
                    formRef.current?.requestSubmit();
                  }}
                >
                  {c}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button
            variant={"light"}
            title="Clear"
            onClick={(e) => {
              chat.clearMessages();
            }}
            size="sm"
          >
            <Trash size={16} />
          </Button>

          {tools}

          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="ms-auto"
            disabled={chat.isRunning}
          >
            {!chat.isRunning && (
              <ArrowUp
                color="white"
                size={18}
                strokeWidth={3}
                style={{ marginTop: -2 }}
              />
            )}
            {chat.isRunning && (
              <Loader
                color="white"
                size={18}
                strokeWidth={3}
                style={{ marginTop: -2 }}
                className="spin"
              />
            )}
          </Button>
        </ButtonToolbar>
      </form>
    </div>
  );
}

function _autoresize(ref: React.RefObject<HTMLTextAreaElement | null>) {
  const el = ref.current;
  if (el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 250) + "px";
  }
}

function autoresize(ref: React.RefObject<HTMLTextAreaElement | null>) {
  return () => {
    _autoresize(ref);
  };
}

function waitAndAutoresize(ref: React.RefObject<HTMLTextAreaElement | null>) {
  const el = ref.current;
  if (el) {
    setTimeout(() => {
      _autoresize(ref);
    }, 100);
  }
}
