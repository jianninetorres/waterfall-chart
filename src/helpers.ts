import { Inter } from "next/font/google";
import { Methods, View } from "./types";

export const MethodsList: Methods[] = ["PEM", "SMR"];
export const ViewOptions: { name: View; color: string; label: string }[] = [
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

export const inter = Inter({ subsets: ["latin"] });
export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
