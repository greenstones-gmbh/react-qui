import { useRef, useState } from "react";

import { Overlay, Popover } from "react-bootstrap";
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
        <Icon color="#777" size={12} />
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
