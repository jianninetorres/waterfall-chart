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

// export const buildDataObj2 = (data: string[][]) => {
//   const _obj = data.map((item, index) => {
//     let prev = data[index - 1];
//     return {
//       name: item[0],
//       subCategory: item[1],
//       prevCost: prev && prev[0] === item[0] ? Number(prev[2]) : 0,
//       cost: Number(item[2]),
//       cumulativeCost:
//         prev && prev[0] === item[0]
//           ? Number(prev[2]) + Number(item[2])
//           : Number(item[2]),
//       carbonIntensity: Number(item[3]),
//     };
//   });

//   const _obj2 = _obj.map((item, index) => {
//     return {
//       name: item.name,
//       subCategory: item.subCategory,
//       prevCost:
//         _obj[index - 1] && item.name === _obj[index - 1].name
//           ? _obj[index - 1].cost
//           : 0,
//       cost: item.cost,
//       cumulativeCost:
//         _obj[index - 1] && item.name === _obj[index - 1].name
//           ? item.cost + _obj[index - 1].cost
//           : item.cost,
//       carbonIntensity: item.carbonIntensity,
//     };
//   });

//   console.log(_obj);
//   console.log(_obj2);
// };
