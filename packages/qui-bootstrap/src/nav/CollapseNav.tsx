import { useState } from "react";
import { Collapse } from "react-bootstrap";

import { Link } from "react-router-dom";
import "./CollapseNav.css";
import classNames from "classnames";

const CollapseNav = ({
  label,
  id,
  children,
  expanded = false,
  className,
}: any) => {
  const [home, setHome] = useState(expanded);

  return (
    <ul className={classNames("list-unstyled ps-0", className)}>
      <li>
        <button
          className="btn btn-toggle d-inline-flex align-items-center rounded border-0 text-white1"
          data-bs-toggle="collapse"
          data-bs-target={`#${id}`}
          aria-expanded={home}
          //style={{ fontWeight: 600 }}
          onClick={(e) => setHome(!home)}
        >
          {label}
        </button>

        <Collapse in={home}>
          <div id={`${id}`}>
            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
              {children}
            </ul>
          </div>
        </Collapse>
      </li>
    </ul>
  );
};

function CollapseNavItem({ children, to }: any) {
  return (
    <li>
      <Link
        to={to}
        className="link-body-emphasis d-inline-flex text-decoration-none rounded text-white1"
      >
        {children}
      </Link>
    </li>
  );
}

export default Object.assign(CollapseNav, {
  Item: CollapseNavItem,
});
