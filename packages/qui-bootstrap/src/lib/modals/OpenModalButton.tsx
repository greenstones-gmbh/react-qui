import { useState } from "react";
import { Button } from "react-bootstrap";

export function OpenModalButton({
  title,
  variant,
  size,
  modal,
  className,
}: {
  title: string;
  variant?: string;
  size?: any;
  className?: string;
  modal: (close: () => void) => void;
}) {
  const [show, setShow] = useState(false);
  const close = () => setShow(false);
  return (
    <>
      <Button
        variant={variant}
        onClick={(e) => setShow(true)}
        className={className}
        size={size}
      >
        {title}
      </Button>
      {show && modal(close)}
    </>
  );
}
