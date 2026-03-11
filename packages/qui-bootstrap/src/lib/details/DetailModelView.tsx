import {
  DetailView,
  DetailBlock,
  DetailItem,
  DetailItemSeparator,
  DetailBlockSeparator,
} from "./DetailView";
import { type DetailModel } from "@greenstones/qui-core";

export function DetailModelView<Type>({
  model,
  value,
  className,
}: {
  model: DetailModel<Type>;
  value: Type;

  className?: string;
}) {
  return (
    <DetailView className={className}>
      {model.blocks.map((block, blockIndex) => (
        <>
          {blockIndex !== 0 && <DetailBlockSeparator />}
          <DetailBlock>
            {block.lines.map((line) => (
              <>
                {line && (
                  <DetailItem label={line.label}>
                    {line.render(value)}
                  </DetailItem>
                )}
                {!line && <DetailItemSeparator />}
              </>
            ))}
          </DetailBlock>
        </>
      ))}
    </DetailView>
  );
}
