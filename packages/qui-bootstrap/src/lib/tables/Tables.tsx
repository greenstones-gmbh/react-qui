import {
  type ListPaging,
  type ListQuery,
  type ListSorting,
} from "@clickapp/qui-core";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";

import { type Column, type Selection } from "@clickapp/qui-core";
import classNames from "classnames";
import {
  TbCaretDownFilled,
  TbCaretUpDownFilled,
  TbCaretUpFilled,
} from "react-icons/tb";

export function SortingColumnHeader({
  header,
  sorting,
  sortId,
}: {
  header: string | JSX.Element;
  sorting: ListSorting | undefined;
  sortId: string | undefined;
}) {
  if (!sorting || !sortId) return <>{header}</>;

  const sort = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (sorting && sortId) sorting?.sortById(sortId);
  };

  return (
    <span className="text-nowrap">
      <a
        href="#"
        className="link-dark link-underline-opacity-0 link-underline-opacity-100-hover"
        onClick={sort}
      >
        {header}
      </a>

      <a
        href="#"
        className={`link-underline-opacity-0 ms-1 ${
          sorting?.isActive(sortId) ? "link-dark" : "link-secondary"
        }`}
        onClick={sort}
      >
        {sorting?.isActiveAndAsc(sortId) ? <TbCaretUpFilled /> : ""}
        {sorting?.isActiveAndDesc(sortId) ? <TbCaretDownFilled /> : ""}
        {!sorting?.isActive(sortId) ? (
          <TbCaretUpDownFilled style={{ color: "#ccc" }} />
        ) : (
          ""
        )}
      </a>
    </span>
  );
}

export function QueryCheckbox<Query>({
  query,
  field,
  checked,
  onChange,
  label,
  className,
}: {
  query?: ListQuery<Query>;
  field?: keyof Query;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
}) {
  var v = checked;
  var chg = onChange;

  if (!v || !chg) {
    const f = field ? query?.field(field) : query?.bind();
    v = f?.checked;
    chg = f?.onChange;
  }

  return (
    <Form className={`d-flex flex-rows align-items-center ${className}`}>
      <Form.Check inline checked={v} id={label} label={label} onChange={chg} />
    </Form>
  );
}

export function QueryInput<Query>({
  query,
  field,
  value,
  onChange,
  placeholder = "Filter...",
  className,
}: {
  query?: ListQuery<Query>;
  field?: keyof Query;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}) {
  let v = value;
  let chg = onChange;

  if (!v || !chg) {
    const f = field ? query?.field(field) : query?.bind();
    v = f?.value;
    chg = f?.onChange;
  }

  return (
    <InputGroup className={className}>
      <Form.Control
        type="search"
        size="sm"
        className=""
        placeholder={placeholder}
        autoFocus
        value={v}
        onChange={chg}
      />
    </InputGroup>
  );
}

export function QueryDropdown<Query>({
  query,
  field,
  label,
  values,
  labels,
  className,
}: {
  query: ListQuery<Query>;
  field?: keyof Query;
  label: string;
  values: any[];
  labels?: string[];
  className?: string;
}) {
  const itemLabels = labels || values;

  const findLabel = (v: any) => {
    return itemLabels[values.indexOf(v)];
  };

  const v = field ? query.value?.[field] : query.value;

  return (
    <DropdownButton
      size="sm"
      className={className}
      variant="outline-primary"
      id="dropdown-basic-button"
      title={`${label}${v ? ": " + findLabel(v) : ""}`}
      onSelect={(e) => {
        let v = undefined;
        if (e) {
          v = values[parseInt(e)];
        }

        if (field) {
          query.setField(field, v);
        } else {
          query.setValue(v);
        }
      }}
    >
      {values.map((v: any, index: number) => (
        <Dropdown.Item key={index} eventKey={index}>
          {itemLabels[index]}
        </Dropdown.Item>
      ))}

      {v != null && (
        <>
          <Dropdown.Divider />
          <Dropdown.Item eventKey={undefined}>Show all</Dropdown.Item>
        </>
      )}
    </DropdownButton>
  );
}

export function Paging({
  paging,
  hidden = false,
  hideOnSinglePage = false,
}: {
  paging?: ListPaging;
  hidden?: boolean;
  hideOnSinglePage?: boolean;
}) {
  if (hidden) return null;

  const isSinglePage = paging && paging.totalPages < 2;

  if (hideOnSinglePage && isSinglePage) return null;

  return (
    <>
      {paging && (
        <div className="d-flex align-items-center gap-4">
          <div className="me-auto text-muted">
            {paging.rangeString} of {paging.totalItems}
          </div>
          {/* <div>
            Page: {paging.pageString} of {paging.totalPages}
          </div> */}
          {!isSinglePage && (
            <>
              <ButtonGroup size="sm">
                <Button
                  onClick={paging?.first}
                  disabled={paging.isFirst}
                  variant="light"
                >
                  «
                </Button>
                <Button
                  onClick={paging?.prev}
                  disabled={!paging.hasPrev}
                  variant="light"
                >
                  ‹
                </Button>

                {paging.pages().map((p) => (
                  <Button
                    key={p.page}
                    variant={p.active ? "primary" : "light"}
                    onClick={p.select}
                  >
                    {p.label}
                  </Button>
                ))}

                <Button
                  onClick={paging?.next}
                  disabled={!paging.hasNext}
                  variant="light"
                >
                  ›
                </Button>
                <Button
                  onClick={paging?.last}
                  disabled={paging.isLast}
                  variant="light"
                >
                  »
                </Button>
              </ButtonGroup>
              <div>
                <span className="text-muted ">Size</span>
                <ButtonGroup size="sm" className="ms-2">
                  {[10, 20, 50].map((p) => (
                    <Button
                      key={p}
                      onClick={(e) => paging.setPageSize?.(p)}
                      variant={paging.pageSize === p ? "primary" : "light"}
                    >
                      {p}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export interface QuickTableDisplayProps<Type> {
  className?: string;
  stripped?: boolean;
  hover?: boolean;
  size?: string;
  rowClassName?: string | ((v: Type) => string | undefined);
}

export function QuickTable<Type = any>({
  items,
  sorting,
  columns,

  selection,
  className,
  stripped,
  hover,
  size,
  rowClassName,
}: {
  items?: Type[];
  sorting?: ListSorting | undefined;
  columns: Column<Type>[];

  selection?: Selection<Type>;
} & QuickTableDisplayProps<Type>) {
  return (
    <Table className={className} striped={stripped} hover={hover} size={size}>
      <thead>
        <tr>
          {columns.map((col, colIndex) => (
            <th
              key={colIndex}
              style={col.width ? { width: col.width } : {}}
              className={col.headerClassName}
            >
              <SortingColumnHeader
                header={col.header || "?"}
                sorting={sorting}
                sortId={col.sortKey}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items?.map((d, index) => (
          <tr
            key={index}
            onClick={(e) => {
              console.log("click ", e, d);

              selection?.onItemClick(d, e);
            }}
            className={classNames(getClassName(d, rowClassName), {
              "table-active": selection?.isSelected(d),
            })}
          >
            {columns.map((col, colIndex) => (
              <td key={colIndex} className={getClassName(d, col.className)}>
                {col.render(d)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function isFunction(v: any): v is Function {
  return typeof v === "function";
}

function getClassName<Type>(
  v: Type,
  fn: string | ((v: Type) => string | undefined) | undefined,
): string | undefined {
  return isFunction(fn) ? fn(v) : fn;
}
