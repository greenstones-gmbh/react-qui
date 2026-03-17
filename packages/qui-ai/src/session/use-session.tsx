import { MemorySession, type Session } from "@openai/agents";
import { useMemo } from "react";
export function useSession(fn: () => Session = () => new MemorySession()) {
  const session = useMemo(() => fn(), [fn]);
  return session;
}
