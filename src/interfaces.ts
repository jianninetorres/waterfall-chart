export interface HomeProps {
  pem: string;
  smr: string;
}

export interface ParseResults {
  data: [];
  errors: [];
  meta: [];
}

export interface DataObj {
  name: string;
  subCategory: string;
  cost: number;
  carbonIntensity: number;
}
