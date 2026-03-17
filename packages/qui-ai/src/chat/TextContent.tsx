export function MessageContent({
  content,
  wrapperClassName,
  className,
}: {
  content: string;
  wrapperClassName?: string;
  className?: string;
}) {
  return (
    <div className={wrapperClassName}>
      <div className={className}>{content}</div>
    </div>
  );
}
