import {
  Agent,
  AgentsError,
  assistant,
  run,
  StreamedRunResult,
  Usage,
  user,
  type AgentInputItem,
  type AgentOutputItem,
  type Session,
  type UnknownItem,
} from "@openai/agents";

import React, {
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import type { MessageItem } from "./MessageItem";
import type { FunctionCallProps } from "./messages/FunctionCall";

// Safari < 16.4 polyfill: ReadableStream does not implement Symbol.asyncIterator
if (
  typeof ReadableStream !== "undefined" &&
  !(ReadableStream.prototype as any)[Symbol.asyncIterator]
) {
  (ReadableStream.prototype as any)[Symbol.asyncIterator] = async function* () {
    const reader = this.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  };
}

const MAX_MESSAGES = 20;

export interface Chat {
  callChat: (
    text: string,
    ops?: {
      monitor?: (state: string) => void;
      data?: { description: string; values: any };
    },
  ) => void;
  messages: MessageItem[];
  streamingMessage: string;
  endRef: React.RefObject<HTMLDivElement | null>;
  clearMessages: () => void;
  isRunning: boolean;
  usage: Usage;
  widgets?: Widgets;
  examples?: string[];
  functionCalls?: Record<string, (props: FunctionCallProps) => ReactNode>;
  defaultFunctionCall?: (props: FunctionCallProps) => ReactNode;
}

export interface Widgets {
  [tag: string]: (props: any) => ReactElement;
}

export interface ChatOption<Context> {
  agent: Agent<Context>;
  session: Session;
  provider?: () => { context: Context; state: any };
  widgets?: Widgets;
  examples?: string[];
  functionCalls?: Record<string, (props: FunctionCallProps) => ReactNode>;
  defaultFunctionCall?: (props: FunctionCallProps) => ReactNode;
}

export function useChat<Context>({
  agent,
  session,
  provider,
  widgets,
  examples,
  functionCalls,
  defaultFunctionCall,
}: ChatOption<Context>): Chat {
  const [usage, setUsage] = useState<Usage>(new Usage());
  const [history, setHistory] = useState<MessageItem[]>([]);
  useEffect(() => {
    session.getItems().then((items) => {
      setHistory(cleanupMessages(items));
    });
  }, []);

  const endRef = useRef<HTMLDivElement>(null);

  //console.log("useChat");

  const [isRunning, setRunning] = useOptimistic<boolean, boolean>(
    false,
    (state, v) => v,
  );

  const clearMessages = () => {
    setHistory([]);
    session.clearSession();
  };

  const scrollToTheEnd = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const [messages, addMessage] = useOptimistic<MessageItem[], MessageItem>(
    history,
    (state, newstring) => [...state, newstring],
  );

  const [streamingMessage, addStreamingMessage] = useOptimistic<string, string>(
    "",
    (state, newstring) => state + "" + newstring,
  );

  const callChat = async (
    text: string,
    ops?: {
      monitor?: (state: string) => void;
      data?: { description: string; values: any };
    },
  ) => {
    console.log("callChat", text);

    const userMessage = user(text);
    //addMessage(userMessage);
    const start = Date.now();

    startTransition(async () => {
      addMessage(userMessage);
      setRunning(true);
      ops?.monitor?.("start");
      scrollToTheEnd();

      //await new Promise((resolve) => setTimeout(resolve, 5000));

      const { context, state } = provider
        ? provider()
        : { context: {}, state: undefined };

      const additionalMessages: any[] = [];
      if (state) {
        additionalMessages.push({
          text: `@@@CURRENT_STATE@@@
            Current State:
            ${stringify(state)}
          `,
          type: "input_text",
        });
      }
      if (ops?.data) {
        additionalMessages.push({
          text: `@@@DATA@@@
          ${ops.data.description} (json):
          ${stringify(ops.data.values)}
          `,
          type: "input_text",
        });
      }

      const msg = user([
        ...additionalMessages,
        {
          text: text,
          type: "input_text",
        },
      ]);

      //const input = createInput(history, msg);

      try {
        const result = await run(agent, [msg], {
          context,
          stream: true,
          maxTurns: 10,
          session,
        });
        // for await (const part of groupChunksByTime(
        //   result.toTextStream(),
        //   100,
        // )) {
        //   startTransition(() => {
        //     addStreamingMessage(part);
        //   });
        //   scrollToTheEnd();
        // }

        for await (const event of result) {
          if (event.type === "run_item_stream_event") {
            const aaa: AgentOutputItem = event.item.rawItem;

            startTransition(() => {
              addStreamingMessage("");
              addMessage(aaa);
              scrollToTheEnd();
            });
          }

          if (
            event.type === "raw_model_stream_event" &&
            event.data.type === "output_text_delta"
          ) {
            const d = event.data.delta;
            startTransition(() => {
              addStreamingMessage(d);
              if (d.indexOf("\n") !== -1) scrollToTheEnd();
            });
            //await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        // const result = await runAgent(agent, input, context, (t) =>
        //   startTransition(() => {
        //     addStreamingMessage(t);
        //     scrollToTheEnd();
        //   }),
        // );
        await result.completed;

        startTransition(() => {
          const duration = Date.now() - start;
          const _usage = getUsage(result);
          console.log(
            `Chat request took ${duration} ms. Tokens: ${_usage.totalTokens}`,
            usage,
            `Messages: `,
            result.history,
          );
          _usage.add(usage);
          setUsage(_usage);

          setHistory(cleanupMessages(result.history));
        });
      } catch (error: any) {
        const message = error.error?.message || error.message || "Error";
        const errorItem: UnknownItem = {
          type: "unknown",
          providerData: {
            type: "error",
            message,
          },
        };

        setHistory(cleanupMessages([...history, msg, errorItem]));

        if (error instanceof AgentsError) {
          // Generic agent error
          console.warn("Agent error:", error);
        } else {
          // console.log("Error:", Object.keys(error));
          console.warn("Unexpected error:", error.message, error);
        }
      }
      scrollToTheEnd();
      ops?.monitor?.("end");
      setRunning(false);
    });
  };

  return {
    callChat,
    messages: [
      ...messages,
      ...(isRunning ? [assistant(streamingMessage)] : []),
    ],
    streamingMessage,
    endRef,
    clearMessages,
    isRunning,
    usage,
    widgets,
    examples,
    functionCalls,
    defaultFunctionCall,
  };
}

function cleanupMessages(history: MessageItem[]) {
  return history.map((m: any) => {
    if (m.role === "user") {
      m.content = m.content.filter(
        (cm: any) =>
          !(
            cm.text.startsWith("@@@CURRENT_STATE@@@") ||
            cm.text.startsWith("@@@DATA@@@")
          ),
      );
      return m;
    }
    return m;
  });
}

function stringify(v: any) {
  if (v == null) return "";
  return JSON.stringify(
    v,
    (_, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  );
}
function createInput(
  history: AgentInputItem[],
  msg: AgentInputItem,
): AgentInputItem[] {
  const m = history
    .filter((m) => m.type !== "unknown")
    .slice(-1 * MAX_MESSAGES);

  const fci = m.findIndex((a) => a.type === "function_call");
  const fcri = m.findIndex((a) => a.type === "function_call_result");

  if (fci > fcri) {
    m.splice(fcri, 1);
  }

  return [...m, msg];
}

function getUsage(result: StreamedRunResult<any, any>) {
  const modelResponses = (result as any).state._modelResponses;
  const usages: Usage[] = modelResponses.map((m: any) => m.usage);
  const sum = new Usage();
  usages.forEach((u) => {
    sum.add(u);
  });
  return sum;
}

async function* streamToAsyncIterable(stream: ReadableStream<string>) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

async function* linesFromChunks(stream: any) {
  //const stream: ReadableStream<string> = source.toTextStream();
  const source = streamToAsyncIterable(stream);

  let buffer = "";

  for await (const chunk of source) {
    buffer += chunk;

    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // Save the last (possibly incomplete) line

    for (const line of lines) {
      yield line;
    }
  }

  if (buffer) {
    yield buffer; // Emit any remaining content as the last line
  }
}

async function* groupChunksByTime(
  source: AsyncIterable<string>,
  intervalMs: number = 1000,
): AsyncGenerator<string> {
  const buffer: string[] = [];
  let resolveFlush: (() => void) | null = null;

  // Timer to flush buffer every intervalMs
  const startTimer = () => {
    return setInterval(() => {
      if (buffer.length > 0 && resolveFlush) {
        resolveFlush();
        resolveFlush = null;
      }
    }, intervalMs);
  };

  const timer = startTimer();

  try {
    for await (const chunk of source) {
      buffer.push(chunk);

      // Wait for timer to flush the buffer
      if (!resolveFlush) {
        await new Promise<void>((resolve) => {
          resolveFlush = resolve;
        });

        const combined = buffer.join("");
        buffer.length = 0;
        yield combined;
      }
    }

    // Final flush after stream ends
    if (buffer.length > 0) {
      yield buffer.join("");
    }
  } finally {
    clearInterval(timer);
  }
}
