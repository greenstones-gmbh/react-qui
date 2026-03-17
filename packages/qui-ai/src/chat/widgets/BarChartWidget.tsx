import { memo } from "react";
import {
  BarChart,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

export const BarChartWidget = memo(function BarChartWidget({
  data: _data,
}: any) {
  const { data, bars, nameKey } = _data;

  return (
    <div className="mt-3">
      {/* <div>{JSON.stringify(bars)}</div> */}
      <BarChart
        style={{
          width: "100%",
          // maxWidth: "300px",
          // maxHeight: "140px",
          aspectRatio: 1.618,
        }}
        responsive
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <XAxis dataKey={nameKey} hide={false} />
        <YAxis
          width="auto"
          hide={true}
          //domain={["auto", "auto"]}
          domain={([dataMin, dataMax]) => {
            if (dataMin - dataMax === 0) {
              return [0, dataMax * 1.2];
            }
            return [
              dataMin - (dataMax - dataMin) * 0.5,
              dataMax + (dataMax - dataMin) * 0.2,
            ];
          }}
        />

        {bars.map((b) => (
          <Bar
            key={b.dataKey}
            dataKey={b.dataKey}
            fill={b.fill}
            isAnimationActive={false}
          />
        ))}

        {/* <Bar dataKey="tiv" fill="#8884d8" /> */}
        {/* <Bar dataKey="premium" /> */}
      </BarChart>
    </div>
  );
});
