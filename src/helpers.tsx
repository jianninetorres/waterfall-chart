import { Inter } from "next/font/google";
import { Methods, View } from "./types";
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
    label: "Carbon Intensity [g CO2/g]",
  },
  {
    name: "cost",
    color: "warning",
    label: "Cost [$/kg]",
  },
];

export const SubCategories: Option[] = [
  {
    name: "CAPEX",
    label: "CAPEX",
  },
  {
    name: "OPEX",
    label: "OPEX",
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

export const buildDataObj = (data: string[][]): DataObj[] => {
  const _obj: DataObj[] = data.map((item, index) => {
    let prev = data[index - 1];
    return {
      name: item[0],
      subCategory: item[1],
      prev_cost: prev && prev[0] === item[0] ? Number(prev[2]) : 0,
      cost: Number(item[2]),
      cumulative_cost:
        prev && prev[0] === item[0]
          ? Number(prev[2]) + Number(item[2])
          : Number(item[2]),
      prev_carbonIntensity: prev && prev[0] === item[0] ? Number(prev[3]) : 0,
      carbonIntensity: Number(item[3]),
      cumulative_carbonIntensity:
        prev && prev[0] === item[0]
          ? Number(prev[3]) + Number(item[3])
          : Number(item[3]),
    };
  });

  const getTotal = (subCategory: string, value: View) => {
    return _obj
      .map((item) => (item.subCategory === subCategory ? item[value] : 0))
      .reduce((acc, curr) => acc + curr);
  };

  const getCAPEXTotalCost = getTotal("CAPEX", "cost");
  const getOPEXTotalCost = getTotal("OPEX", "cost");
  const getCAPEXTotalCarbonIntensity = getTotal("CAPEX", "carbonIntensity");
  const getOPEXTotalCarbonIntensity = getTotal("OPEX", "carbonIntensity");

  const subCategoryTotals = [
    {
      name: "CAPEX",
      totalCost: getCAPEXTotalCost,
      totalCarbonIntensity: getCAPEXTotalCarbonIntensity,
    },
    {
      name: "OPEX",
      totalCost: getOPEXTotalCost,
      totalCarbonIntensity: getOPEXTotalCarbonIntensity,
    },
  ];

  const calculatedTotals = [..._obj];

  subCategoryTotals.forEach(({ name, totalCarbonIntensity, totalCost }) =>
    calculatedTotals.push({
      name: "Total",
      subCategory: name,
      cost: totalCost,
      prev_cost: 0,
      cumulative_cost: 0,
      carbonIntensity: totalCarbonIntensity,
      prev_carbonIntensity: 0,
      cumulative_carbonIntensity: 0,
    })
  );

  return calculatedTotals;
};

export const GetDataCells = (dataSet: DataObj[]) =>
  dataSet.map((entry, index) => {
    return <Cell fill={COLORS[entry.subCategory] ?? COLORS.none} key={index} />;
  });
