import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";

export const Tabs = ({
  // tabs: tabList,
  defaultActiveKey = "general",
  className = "mt-4",
  tabClassName = "mt-3",
  onChange,
  children,
}: any) => {
  const tabs = useTabs(defaultActiveKey, onChange);

  const cc = React.Children.toArray(children).filter((c: any) =>
    React.isValidElement(c)
  );

  return (
    <div className={classNames("flex-fill d-flex flex-column", className)}>
      <Nav variant="tabs" className="">
        {React.Children.map(cc, (child: any, index) => (
          <Nav.Item>
            <Nav.Link {...tabs.props(child.props.eventKey)}>
              {child.props.title}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {React.Children.map(cc, (child: any, index) => {
        const childProps = { ...child.props };

        return tabs.isActive(childProps.eventKey) ? (
          <div
            className={classNames("d-flex flex-fill flex-column", tabClassName)}
          >
            {childProps.children}
          </div>
        ) : null;
      })}
    </div>
  );
};

const useTabs = (initialValue: string, onChange: any) => {
  const [activeTab, setActiveTab] = useState<string>(initialValue);

  useEffect(() => {
    setActiveTab(initialValue);
  }, [initialValue]);

  const props = (name: string) => ({
    onClick: (e: any) => {
      setActiveTab(name);
      onChange?.(name);
    },
    active: activeTab === name,
  });

  const isActive = (name: string) => activeTab === name;

  return { activeTab, setActiveTab, props, isActive };
};
