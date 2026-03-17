import { IconPopupTrigger } from "@greenstones/qui-bootstrap";
import type { FunctionCallItem, FunctionCallResultItem } from "@openai/agents";
import { CircleCheck, Info, Loader } from "lucide-react";
import type { PropsWithChildren } from "react";
import { stringifyWithFormat } from "../../utils/stringify";

export function FunctionCall({
  call,
  result,
}: PropsWithChildren<{
  call: FunctionCallItem;
  result?: FunctionCallResultItem;
}>) {
  const isRunning = !result;
  return (
    <div className="mb-1 d-flex">
      <div className="bg-light  px-2 rounded-2 small text-muted">
        {isRunning ? (
          <>
            <Loader size={12} color="gray" className="spin me-1" />
            Calling{" "}
            <code>
              {call.name}({getArgumentsPreview(call.arguments)})
            </code>{" "}
            ...
          </>
        ) : (
          <>
            <CircleCheck size={12} color="green" className="me-1" />{" "}
            <code>
              {call.name}({getArgumentsPreview(call.arguments)})
            </code>{" "}
            {result?.status}.
          </>
        )}

        <IconPopupTrigger Icon={Info} className="ms-2">
          <div className="overflow-auto" style={{ maxHeight: 400 }}>
            <pre>{stringifyWithFormat(call)}</pre>
            <hr />
            <pre>{stringifyWithFormat(result)}</pre>
          </div>
        </IconPopupTrigger>
      </div>
    </div>
  );
}

function getArgumentsPreview(args: string): string | undefined {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(args);
  } catch {
    return undefined;
  }

  return Object.values(parsed)
    .filter((v) => typeof v === "string" || typeof v === "number" || typeof v === "boolean")
    .slice(0, 4)
    .map((v) => {
      const s = String(v);
      return s.length > 12 ? s.slice(0, 12) + "..." : s;
    })
    .join(", ");
}
