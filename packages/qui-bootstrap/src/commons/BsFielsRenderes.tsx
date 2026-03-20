import {
  FieldRenderers,
  type RenderFieldFunction,
} from "@greenstones/qui-core";
import type { HTMLAttributeAnchorTarget, ReactNode } from "react";
import { BsBoxArrowUpRight } from "react-icons/bs";

export const BsFieldRenderers = {
  asExternalLink<EntityType, FieldType>({
    className,
    target = "_blank",
    href,
    postEl = (
      <BsBoxArrowUpRight className="ms-1" size={10} style={{ marginTop: -2 }} />
    ),
    title,
  }: {
    className?: string;
    target?: HTMLAttributeAnchorTarget;
    href: (v: EntityType) => string | undefined;
    postEl?: ReactNode;
    title?: string;
  }): RenderFieldFunction<EntityType, FieldType> {
    return FieldRenderers.asExternalLink<EntityType, FieldType>({
      href,
      className,
      target,
      postEl,
      title,
    });
  },
};
