import type { Session, AgentInputItem } from "@openai/agents";

export class LocalSession implements Session {
  private id: string;

  constructor(sessionId: string) {
    this.id = sessionId;
  }

  async getSessionId() {
    return this.id;
  }

  async getItems(limit?: number): Promise<AgentInputItem[]> {
    const text = localStorage.getItem(`mapai.session-${this.id}.jsonl`);
    if (!text) return [];
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    const slice = limit != null ? lines.slice(-limit) : lines;
    return slice.map((l) => JSON.parse(l));
  }

  async addItems(items: AgentInputItem[]): Promise<void> {
    const text = localStorage.getItem(`mapai.session-${this.id}.jsonl`) || "";
    const toAppend =
      items.map((item) => JSON.stringify(item)).join("\n") + "\n";
    localStorage.setItem(`mapai.session-${this.id}.jsonl`, text + toAppend);
  }

  async popItem(): Promise<AgentInputItem | undefined> {
    const text = localStorage.getItem(`mapai.session-${this.id}.jsonl`);
    if (!text) return undefined;
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length === 0) return undefined;
    const last = lines.pop()!;
    localStorage.setItem(
      `mapai.session-${this.id}.jsonl`,
      lines.length > 0 ? lines.join("\n") + "\n" : "",
    );
    return JSON.parse(last);
  }

  async clearSession(): Promise<void> {
    localStorage.removeItem(`mapai.session-${this.id}.jsonl`);
  }
}
