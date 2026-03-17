import { createOpenAI } from "@ai-sdk/openai";
import { LocalSession } from "@greenstones/qui-ai";
import { Agent } from "@openai/agents";
import { aisdk } from "@openai/agents-extensions/ai-sdk";

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1/",
});

const model = aisdk(openai("gpt-4.1-mini"));
export const appAgentSession = new LocalSession("app-agent");

export const appAgent = new Agent({
  name: "App Agent",
  instructions: ``,
  model: model,
  tools: [],
});
