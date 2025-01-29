import { PropsWithChildren, ReactNode } from "react";
import { Button, ButtonToolbar, Modal } from "react-bootstrap";
import { Column } from "@clickapp/qui-core";
import { ListData } from "@clickapp/qui-core";
import { useSelection } from "@clickapp/qui-core";
import { Paging, QueryInput, QuickTable } from "../tables/Tables";
import { ActionButton } from "../buttons/ActionButton";

export function PickerModal<Type, Query>({
  handleClose,

  columns,
  size,
  listData,
  title = "Picker",
  onSelect,
}: PropsWithChildren<{
  handleClose: any;
  columns: Column<Type>[];
  size?: "sm" | "lg" | "xl";
  listData: ListData<Type, Query>;
  title?: ReactNode;
  onSelect: (selectedItems: Type[]) => Promise<void> | void;
}>) {
  const list = listData;
  const { items, sorting, paging, query } = list;
  const selection = useSelection<Type>(false, (v) => {
    onSelect([v]);
    handleClose();
  });

  return (
    <Modal
      show={true}
      onHide={handleClose}
      backdrop="static"
      keyboard={true}
      size={size}
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <ButtonToolbar className="">
          <QueryInput query={query} className="me-2" placeholder="Filter" />
        </ButtonToolbar>
        <div
          style={{ height: 600 }}
          className="flex-fill d-flex flex-column overflow-auto mt-2 mb-4"
        >
          <QuickTable<Type>
            items={items}
            sorting={sorting}
            columns={columns}
            selection={selection}
          />
        </div>
        <div className="mb-0">
          <Paging paging={paging} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <ActionButton
          variant="primary"
          //type="submit"
          disabled={selection?.selectedItems.length < 1}
          onClick={async (e: any) => {
            await onSelect(selection.selectedItems);
            handleClose();
          }}
          // disabled={
          //   isSubmitting || !successButtonEnabled
          //   //||(successButtonEnabledOnlyOnValid && !isValid)
          // }
        >
          Select
        </ActionButton>
      </Modal.Footer>
    </Modal>
  );
}
