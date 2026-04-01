import { useRef, useState } from "react";

import { Overlay, Popover } from "react-bootstrap";
import { BsInfoCircle } from "react-icons/bs";
import { ActionLink } from "../buttons/ActionLink";

export function IconPopupTrigger({ Icon, children, className }: any) {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <>
      <ActionLink
        ref={target}
        className={className}
        onClick={async () => setShow(!show)}
      >
        <Icon color="#777" size={12} style={{ marginTop: -2 }} />
      </ActionLink>

      <Overlay
        target={target.current}
        show={show}
        placement="bottom-end"
        rootClose
        onHide={() => setShow(false)}
      >
        <Popover id="popover-basic">
          <Popover.Body>{children}</Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
}

export function InfoPopup({ v, Icon = BsInfoCircle }: any) {
  if (!v) return undefined;

  const text = typeof v === "string" ? v : JSON.stringify(v, null, 2);
  return (
    <IconPopupTrigger Icon={Icon} className="ms-2">
      <div className="overflow-auto" style={{ maxHeight: 400 }}>
        <pre>{text}</pre>
      </div>
    </IconPopupTrigger>
  );
}
