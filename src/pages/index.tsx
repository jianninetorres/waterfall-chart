import { MethodsList, ViewOptions, buildDataObj } from "@/helpers";
import { DataObj, HomeProps, ParseResults } from "@/interfaces";
import { Methods, View } from "@/types";
import { Button, Stack, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Home = ({ pem, smr }: HomeProps) => {
  const { readString } = usePapaParse();

  const [PEMData, setPEMData] = useState<DataObj[]>([]);
  const [SMRData, setSMRData] = useState<DataObj[]>([]);
  const [file, setFile] = useState<Methods>("PEM");
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

  return (
    <>
      <h1>Hydrogen Production</h1>
      <BarChart
        width={900}
        height={500}
        data={file === "PEM" ? PEMData : SMRData}
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
            <Bar
              dataKey="carbonIntensity"
              name="Carbon Intensity"
              stackId="a"
              fill="transparent"
            />
            <Bar dataKey="cost" name="Cost" stackId="a" fill="#f57c00" />
            <Bar
              dataKey="subCategory"
              stackId="a"
              fill="#325aa8"
              fillOpacity={0}
              name="Sub category"
            />
          </>
        ) : (
          <>
            <Bar dataKey="cost" name="Cost" stackId="a" fill="transparent" />
            <Bar
              dataKey="carbonIntensity"
              name="Carbon Intensity"
              stackId="a"
              fill="#388e3c"
            />
            <Bar
              dataKey="subCategory"
              stackId="a"
              fill="#325aa8"
              fillOpacity={0}
              name="Sub category"
            />
          </>
        )}
      </BarChart>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        gap={2}
      >
        <Stack spacing={2} width={200}>
          <h2>Methods</h2>
          {MethodsList.map((method) => (
            <Button
              onClick={() => setFile(method)}
              variant={file === method ? "contained" : "outlined"}
              key={method}
            >
              {method}
            </Button>
          ))}
        </Stack>
        <Stack spacing={2} width={200}>
          <h2>Options</h2>
          {ViewOptions.map((option) => (
            <Button
              onClick={() => setView(option.name)}
              variant={view === option.name ? "contained" : "outlined"}
              key={option.name}
              color={option.color}
            >
              {option.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </>
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
