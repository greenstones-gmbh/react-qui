import {
  DetailView,
  DetailBlock,
  DetailItem,
  DetailItemSeparator,
  DetailBlockSeparator,
} from "./DetailView";
import { DetailModel } from "@clickapp/qui-core";

export function DetailModelView<Type, Context = any>({
  model,
  value,
  context,
}: {
  model: DetailModel<Type>;
  value: Type;
  context?: Context;
}) {
  return (
    <DetailView>
      {model.blocks.map((block, blockIndex) => (
        <>
          {blockIndex !== 0 && <DetailBlockSeparator />}
          <DetailBlock>
            {block.lines.map((line) => (
              <>
                {line && (
                  <DetailItem label={line.label}>
                    {line.render(value, context)}
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
