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
  data.map((item) => {
    return {
      name: item[0],
      subCategory: item[1],
      cost: Number(item[2]),
      carbonIntensity: Number(item[3]),
    };
  });
