import { Usage, type StreamedRunResult } from "@openai/agents";

export function getUsage(result: any) {
  const modelResponses = (result as any).state._modelResponses;
  const usages: Usage[] = modelResponses.map((m: any) => m.usage);
  const sum = new Usage();
  usages.forEach((u) => {
    sum.add(u);
  });
  return sum;
}
