import { memo } from "react";
import { Cell, Legend, Pie, PieChart } from "recharts";

import chroma from "chroma-js";

export const PieChartWidget = memo(function PieChartWidget({
  data: _data,
}: any) {
  const { data, dataKey, nameKey } = _data;

  const colors = chroma.scale("Dark2").colors(data.length);

  return (
    <div className="mt-3">
      {/* <div>{JSON.stringify(_data)}</div> */}
      <PieChart
        style={{
          width: "100%",
          // maxWidth: "240px",
          maxHeight: "30vh",
          aspectRatio: 1,
        }}
        responsive={true}
      >
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          // cx="50%"
          // cy="50%"
          // outerRadius="50%"
          label={true}
          fill="#8884d8"
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
});
