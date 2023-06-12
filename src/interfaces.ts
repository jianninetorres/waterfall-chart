import { View } from "./types";

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
  prev_cost: number;
  cumulative_cost: number;
  carbonIntensity: number;
  prev_carbonIntensity: number;
  cumulative_carbonIntensity: number;
}

export interface Option {
  name: string;
  label: string;
  color?: string;
}
