export const BootstrapStylesComponents = {
  h1: ({ children }) => <h1 className="">{children}</h1>,
  h2: ({ children }) => <h2 className="">{children}</h2>,
  h3: ({ children }) => <h3 className="h3 mt-4 mb-3">{children}</h3>,
  p: ({ children }) => <p className="mb-1">{children}</p>,
  ul: ({ children }) => <ul className="mb-3">{children}</ul>,
  li: ({ children }) => <li className="">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="blockquote">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="table-responsive my-2">
      <table className="table table-bordered">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="">{children}</thead>,
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-light text-danger rounded">{children}</code>
    ) : (
      // <pre className="bg-light p-2 rounded my-1">
      <code>{children}</code>
      // </pre>
    ),
  strong: ({ children }) => <strong className="">{children}</strong>,
  em: ({ children }) => (
    <em className="fst-italic text-secondary">{children}</em>
  ),
  hr: () => <hr className="" />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};
