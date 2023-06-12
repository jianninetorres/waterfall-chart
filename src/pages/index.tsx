import "../app/globals.css";

import {
  COLORS,
  MethodsList,
  ViewOptions,
  buildDataObj,
  inter,
} from "@/helpers";
import { DataObj, HomeProps, ParseResults } from "@/interfaces";
import { Methods, View } from "@/types";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Home = ({ pem, smr }: HomeProps) => {
  const { readString } = usePapaParse();

  const [PEMData, setPEMData] = useState<DataObj[]>([]);
  const [SMRData, setSMRData] = useState<DataObj[]>([]);
  const [method, setMethod] = useState<Methods>("PEM");
  const [view, setView] = useState<View>("cost");

  useEffect(() => {
    const getData = (data: string) =>
      readString(data, {
        complete: (results) => {
          console.log("---------------------------");
          console.log("Results:", results);
          console.log("---------------------------");
        },
        worker: false,
      }) as unknown as ParseResults;

    const pemData = getData(pem);
    const smrData = getData(smr);

    pemData.data.shift();
    smrData.data.shift();

    const _PEMdata = buildDataObj(pemData.data);
    const _SMRdata = buildDataObj(smrData.data);

    setPEMData(_PEMdata);
    setSMRData(_SMRdata);
  }, []);

  const GetDataCells = (dataSet: DataObj[]) =>
    dataSet.map((entry, index) => {
      const color = entry.subCategory === "CAPEX" ? COLORS[0] : COLORS[1];
      return <Cell fill={color} key={index} />;
    });

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      gap={2}
      paddingTop={10}
      className={inter.className}
    >
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        gap={2}
      >
        <Stack spacing={2} width={200}>
          <FormControl>
            <h2>Methods</h2>
            <RadioGroup
              aria-labelledby="controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={method}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setMethod(event.target.value as Methods)
              }
            >
              {MethodsList.map((method) => (
                <FormControlLabel
                  value={method}
                  control={<Radio />}
                  label={method}
                  key={method}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
        <Stack spacing={2} width={200}>
          <FormControl>
            <h2>Options</h2>
            <RadioGroup
              aria-labelledby="controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={view}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setView(event.target.value as View)
              }
            >
              {ViewOptions.map((option) => (
                <FormControlLabel
                  value={option.name}
                  control={<Radio />}
                  label={option.label}
                  key={option.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      </Stack>
      <Stack direction="column">
        <h1>Hydrogen Production</h1>
        <BarChart
          width={1100}
          height={500}
          data={method === "PEM" ? PEMData : SMRData}
          margin={{
            top: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {view === "cost" ? (
            <>
              <Bar dataKey="prevCost" stackId="a" fill="transparent" />
              <Bar dataKey="cost" name="Cost" stackId="a" fill="#fff">
                {method === "PEM"
                  ? GetDataCells(PEMData)
                  : GetDataCells(SMRData)}
              </Bar>
            </>
          ) : (
            <>
              <Bar
                dataKey="prevCarbonIntensity"
                stackId="a"
                fill="transparent"
              />
              <Bar
                dataKey="carbonIntensity"
                name="Carbon Intensity"
                stackId="a"
                fill="#fff"
              >
                {method === "PEM"
                  ? GetDataCells(PEMData)
                  : GetDataCells(SMRData)}
              </Bar>
            </>
          )}
          <Bar
            dataKey="CAPEX"
            stackId="a"
            fill={COLORS[0]}
            fillOpacity={0}
            name="CAPEX"
          />
          <Bar
            dataKey="OPEX"
            stackId="a"
            fill={COLORS[1]}
            fillOpacity={0}
            name="OPEX"
          />
        </BarChart>
      </Stack>
    </Stack>
  );
};

export default Home;

export async function getStaticProps() {
  const pem = await fetch(
    "https://storage.googleapis.com/othersphere-recruitment/frontend-selection-test/PEM.csv"
  ).then((resp) => resp.text());

  const smr = await fetch(
    "https://storage.googleapis.com/othersphere-recruitment/frontend-selection-test/SMR.csv"
  ).then((resp) => resp.text());

  return {
    props: { pem, smr },
  };
}
