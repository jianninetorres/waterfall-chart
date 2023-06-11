export interface HomeProps {
  pem: string;
  smr: string;
}

export interface ParseResults {
  data: [];
  errors: [];
  meta: [];
}

export const buildDataObj = (data: string[][]) =>
  data.map((item) => {
    return {
      name: item[0],
      subCategory: item[1],
      cost: Number(item[2]),
      carbonIntensity: Number(item[3]),
    };
  });
