import { Card, CardGroup } from "react-bootstrap";

export const DetailView = ({ className, children }: any) => {
  return (
    <CardGroup className={className}>
      {/* {groups.map((g, index) => (
        <Fragment key={index}>
          {index !== 0 && (
            <div className="border-left" style={{ width: 1 }}></div>
          )}
          <DetailBlock data={data} fields={g} width={width} />
        </Fragment>
      ))} */}
      {children}
    </CardGroup>
  );
};

export const DetailBlock = ({ className, children }: any) => {
  return (
    <Card bg="light" border="light" body className="">
      <div className={className}>{children}</div>
    </Card>
  );
};

export const DetailItem = ({ label, children, width = 130 }: any) => {
  //   if (!field) return <div className="my-2"></div>;

  return (
    <div className="d-flex">
      <div
        className="text-muted d-inline-block flex-shrink-0  text-nowrap"
        style={{ width }}
      >
        {label}
      </div>
      <div className="d-inline-block ml-2">{children}</div>
    </div>
  );
};

export const DetailItemSeparator = () => {
  return <div className="my-2"></div>;
};

export const DetailBlockSeparator = () => {
  return <div className="border-left" style={{ width: 2 }}></div>;
};
