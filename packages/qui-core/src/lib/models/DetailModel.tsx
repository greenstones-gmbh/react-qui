import { useMemo } from "react";
import { Field, FieldOptions, Fields } from "../fields/Fields";

export class DetailModelBuilder<Type> {
  blocks: DetaiModelBlock<Type>[] = [];
  lines: (Field<Type> | undefined)[] = [];

  constructor() {
    this.blocks.push({ lines: this.lines });
  }

  // line(
  //   label: string,
  //   render: (v: Type) => ReactNode
  // ): DetailModelBuilder<Type> {
  //   return this.addLine({ label, render });
  // }

  line(op: FieldOptions<Type, any, any>): DetailModelBuilder<Type> {
    const field = Fields.create(op);
    return this.addLine(field);
  }

  addLine(field: Field<Type>) {
    this.lines.push(field);
    return this;
  }

  separator(): DetailModelBuilder<Type> {
    this.lines.push(undefined);
    return this;
  }

  block(): DetailModelBuilder<Type> {
    this.lines = [];
    this.blocks.push({ lines: this.lines });
    return this;
  }

  fromObject(obj?: Type, cols = 2): DetaiModelBlock<Type> {
    if (obj) {
      const bp = Math.ceil(Object.keys(obj).length / cols);
      Object.keys(obj).forEach((k, i) => {
        if (i !== 0 && i % bp === 0) {
          this.block();
        }
        this.addLine(Fields.byProp(k as any));
      });
    }
    return this;
  }

  build(): DetailModel<Type> {
    return {
      blocks: this.blocks,
    };
  }
}
export interface DetailModel<Type> {
  blocks: DetaiModelBlock<Type>[];
}
export interface DetaiModelBlock<Type> {
  lines: (Field<Type> | undefined)[];
}

export function createDetails<Type = any>(
  configurer?: (builder: DetailModelBuilder<Type>) => void
) {
  const tb = new DetailModelBuilder<Type>();
  configurer?.(tb);
  return tb.build();
}

export function useDetaiModelBuilder<Type>(
  configurer?: (builder: DetailModelBuilder<Type>) => void
) {
  return useMemo(() => {
    return createDetails<Type>(configurer);
  }, []);
}

export function useDetaiModelGenerator<Type>(v?: Type) {
  return useMemo(() => {
    return createDetails<Type>((builder) => {
      if (v) {
        builder.fromObject(v);
      }
    });
  }, [v]);
}
