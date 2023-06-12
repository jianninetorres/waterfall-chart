import { COLORS, GetDataCells } from "@/helpers";
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
      {view === "cost" ? (
        <>
          <Bar dataKey="prevCost" stackId="a" fill="transparent" />
          <Bar dataKey="cost" name="Cost" stackId="a" fill={COLORS.cost}>
            {GetDataCells(data[method])}
          </Bar>
        </>
      ) : (
        <>
          <Bar dataKey="prevCarbonIntensity" stackId="a" fill="transparent" />
          <Bar
            dataKey="carbonIntensity"
            name="Carbon Intensity"
            stackId="a"
            fill={COLORS.carbonIntensity}
          >
            {GetDataCells(data[method])}
          </Bar>
        </>
      )}
      <Bar
        dataKey="CAPEX"
        stackId="a"
        fill={COLORS.CAPEX}
        fillOpacity={0}
        name="CAPEX"
      />
      <Bar
        dataKey="OPEX"
        stackId="a"
        fill={COLORS.OPEX}
        fillOpacity={0}
        name="OPEX"
      />
    </BarChart>
  );
};

export default WaterfallChart;