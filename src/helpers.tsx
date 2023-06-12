import { Inter } from "next/font/google";
import { Methods } from "./types";
import { Cell } from "recharts";
import { DataObj, Option } from "./interfaces";

export const MethodsList: Option[] = [
  {
    name: "pem",
    label: "PEM",
  },
  {
    name: "smr",
    label: "SMR",
  },
];

export const ViewOptions: Option[] = [
  {
    name: "carbonIntensity",
    color: "success",
    label: "Carbon Intensity",
  },
  {
    name: "cost",
    color: "warning",
    label: "Cost",
  },
];

export const inter = Inter({ subsets: ["latin"] });

export const COLORS: Record<string, string> = {
  CAPEX: "#0088FE",
  OPEX: "#00C49F",
  none: "#6e6e6e",
  carbonIntensity: "#388e3c",
  cost: "#f57c00",
};

export const buildDataObj = (data: string[][]) =>
  data.map((item, index) => {
    let prev = data[index - 1];
    return {
      name: item[0],
      subCategory: item[1],
      prevCost: prev && prev[0] === item[0] ? Number(prev[2]) : 0,
      cost: Number(item[2]),
      cumulativeCost:
        prev && prev[0] === item[0]
          ? Number(prev[2]) + Number(item[2])
          : Number(item[2]),
      prevCarbonIntensity: prev && prev[0] === item[0] ? Number(prev[3]) : 0,
      carbonIntensity: Number(item[3]),
      cumulativeCarbonIntensity:
        prev && prev[0] === item[0]
          ? Number(prev[3]) + Number(item[3])
          : Number(item[3]),
    };
  });

export const GetDataCells = (dataSet: DataObj[]) =>
  dataSet.map((entry, index) => {
    return <Cell fill={COLORS[entry.subCategory] ?? COLORS.none} key={index} />;
  });
