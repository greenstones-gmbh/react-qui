import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export function MarkdownContent({
  content,
  wrapperClassName,
  className,
  components,
}: {
  content: string;
  wrapperClassName?: string;
  className?: string;
  components?: any;
}) {
  return (
    <div className={wrapperClassName}>
      <div className={`qui-markdown ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
