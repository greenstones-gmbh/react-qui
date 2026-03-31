import { IconPopupTrigger } from "@greenstones/qui-bootstrap";
import type { FunctionCallItem, FunctionCallResultItem } from "@openai/agents";
import { CircleCheck, Info, Loader } from "lucide-react";
import { useMemo, type PropsWithChildren, type ReactNode } from "react";
import { stringifyWithFormat } from "../../utils/stringify";

export interface FunctionCallProps extends PropsWithChildren {
  call: FunctionCallItem;
  result?: FunctionCallResultItem;
}

export function FunctionCall({ call, result }: FunctionCallProps) {
  const isRunning = !result;

  const outputText = useMemo(() => {
    if (!result?.output) return undefined;
    const o = result?.output as any;
    try {
      return "json";
    } catch (error) {
      return o.text;
    }
  }, [result?.output]);

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
            <br />
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

interface FunctionCallsProps extends FunctionCallProps {
  functionCalls?: Record<string, (props: FunctionCallProps) => ReactNode>;
  defaultFunctionCalls?: (props: FunctionCallProps) => ReactNode;
}

export function FunctionCalls({
  call,
  result,
  functionCalls,
  defaultFunctionCalls: DefaultFC,
}: FunctionCallsProps) {
  const El = functionCalls?.[call.name];
  if (El) {
    return <El call={call} result={result} />;
  }
  if (DefaultFC) {
    return <DefaultFC call={call} result={result} />;
  }

  return undefined;
}

export function BaseFunctionCallBox({
  children,
  call,
  result,
}: FunctionCallProps) {
  return (
    <div className="mb-1 d-flex">
      <div className="bg-light  px-2 rounded-2 small text-muted d-flex flex-row">
        <div className="">
          <FunctionCallStatusIcon {...{ call, result }} />
        </div>
        <div className="">{children}</div>
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
    .filter(
      (v) =>
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean",
    )
    .slice(0, 4)
    .map((v) => {
      const s = String(v);
      return s.length > 12 ? s.slice(0, 12) + "..." : s;
    })
    .join(", ");
}

export function FunctionCallStatusIcon({ call, result }: FunctionCallProps) {
  const isRunning = !result;
  return (
    <>
      {isRunning ? (
        <Loader size={12} color="gray" className="spin me-2" />
      ) : (
        <CircleCheck size={12} color="green" className="me-2" />
      )}
    </>
  );
}

export function BaseFunctionCall(
  props: {
    renderCall: (args: any) => ReactNode;
    renderResultData?: ({ data }: { data: any }) => ReactNode;
    renderResultText?: ({ text }: { text: string }) => ReactNode;
  } & FunctionCallProps,
) {
  const args = JSON.parse(props.call.arguments);
  return (
    <BaseFunctionCallBox {...props}>
      <span>{props.renderCall(args)}</span>
      {!!props.result && <BaseFunctionCallResult {...props} />}
    </BaseFunctionCallBox>
  );
}

export function BaseFunctionCallResult(
  props: {
    renderResultData?: ({ data }: any) => ReactNode;
    renderResultText?: ({ text }: any) => ReactNode;
  } & FunctionCallProps,
) {
  const output = props.result?.output as any;
  const text = "text" in output ? output.text : undefined;
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = undefined;
  }

  if (data && props.renderResultData) {
    return (
      <>
        <br />
        {props.renderResultData?.({ data })}
      </>
    );
  }

  if (props.renderResultText) {
    return (
      <>
        <br />
        {props.renderResultText?.({ text })}
      </>
    );
  }

  return (
    <>
      <br />
      Status: {props.result?.status}{" "}
      <IconPopupTrigger Icon={Info} className="ms-2">
        <div className="overflow-auto" style={{ maxHeight: 400 }}>
          <pre>{data ? stringifyWithFormat(data) : text}</pre>
          <hr />
          <pre>{stringifyWithFormat(props.call)}</pre>
          <hr />
          <pre>{stringifyWithFormat(props.result)}</pre>
        </div>
      </IconPopupTrigger>
    </>
  );
}
