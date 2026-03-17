import { IconPopupTrigger } from "@greenstones/qui-bootstrap";
import type { FunctionCallItem, FunctionCallResultItem } from "@openai/agents";
import { Info } from "lucide-react";
import type { PropsWithChildren } from "react";
import { stringifyWithFormat } from "../../utils/stringify";

export function FunctionCallResult({
  message,
}: PropsWithChildren<{ message: FunctionCallResultItem }>) {
  return (
    <div className=" ms-4 mb-1 d-flex">
      <div className="bg-light py-1 px-3 rounded-2 small">
        <code className="">{message.name}(...)</code> {message.status}.{" "}
        <IconPopupTrigger Icon={Info}>
          <div className="overflow-auto" style={{ maxHeight: 400 }}>
            <pre>{stringifyWithFormat(message)}</pre>
          </div>
        </IconPopupTrigger>
      </div>
    </div>
  );
}
