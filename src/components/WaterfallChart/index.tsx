import { COLORS, GetDataCells, SubCategories } from "@/helpers";
import { DataObj } from "@/interfaces";
import { Methods, View } from "@/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WaterfallChartProps {
  view: View;
  method: Methods;
  data: {
    pem: DataObj[];
    smr: DataObj[];
  };
}

const WaterfallChart = ({ view, method, data }: WaterfallChartProps) => {
  return (
    <BarChart
      width={1100}
      height={500}
      data={data[method]}
      margin={{
        top: 20,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip contentStyle={{ color: "black" }} />
      <Legend />
      <>
        <Bar dataKey={`prev_${view}`} stackId="a" fill="transparent" />
        <Bar dataKey={view} name={view} stackId="a" fill={COLORS[view]}>
          {GetDataCells(data[method])}
        </Bar>
      </>
      {SubCategories.map((category) => (
        <Bar
          dataKey={category.name}
          stackId="a"
          fill={COLORS[category.name]}
          fillOpacity={0}
          name={category.label}
          key={category.name}
        />
      ))}
    </BarChart>
  );
};

export default WaterfallChart;
