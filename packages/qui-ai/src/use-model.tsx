import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { ApplicationError } from "@greenstones/qui-core";

import { useMemo } from "react";

const anthropic = createAnthropic({
  apiKey: "1",
  baseURL: "/api/anthropic",
});

const openai = createOpenAI({
  apiKey: "1",
  baseURL: "/api/openai",
});

const bedrock = createAmazonBedrock({
  region: "1",
  apiKey: "1",
  baseURL: "/api/bedrock",
});

export function createLanguageModel({
  aiProvider = "openai",
  model,
}: {
  aiProvider?: "openai" | "bedrock" | "anthropic";
  model?: string;
}) {
  if (aiProvider === "openai") return openai(model || "gpt-4.1");
  if (aiProvider === "anthropic") return anthropic(model || "claude-haiku-4-5");
  if (aiProvider === "bedrock")
    return bedrock(model || "eu.amazon.nova-pro-v1:0");

  throw new ApplicationError(
    "AI SDK not found",
    `AI SDK ${aiProvider}, model : ${model} not found`,
  );
}

export function useLanguageModel({
  aiProvider = "openai",
  model,
}: {
  aiProvider?: "openai" | "bedrock" | "anthropic";
  model?: string;
}) {
  const m = useMemo(
    () =>
      createLanguageModel({
        aiProvider,
        model,
      }),
    [aiProvider, model],
  );
  return m;
}
