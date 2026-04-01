import { createOpenAI } from "@ai-sdk/openai";
import { ChatPage, LocalSession, useChat } from "@greenstones/qui-ai";
import { Agent, tool } from "@openai/agents";
import { aisdk } from "@openai/agents-extensions/ai-sdk";
import { z } from "zod";

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1/",
});

const model = aisdk(openai("gpt-4.1-mini"));
const session = new LocalSession("ls");

const agent = new Agent({
  name: "Personal Agent",
  instructions: ``,
  model: model,
  tools: [],
});

export function ChatLight() {
  const chat = useChat({
    agent,
    session,
  });
  return (
    <ChatPage
      header="Chat (light styling)"
      chat={chat}
      containerWidth={5}
      variant="bordered"
      formClassName="bg-white"
      className="bg-light"
      userMessagePosition="end"
      userMessageClassName="px-3 py-2 rounded-4 bg-white shadow-sm"
    />
  );
}
