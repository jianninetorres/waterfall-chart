import {
  MethodsList,
  ViewOptions,
  buildDataObj,
  buildDataObj2,
} from "@/helpers";
import { DataObj, HomeProps, ParseResults } from "@/interfaces";
import { Methods, View } from "@/types";
import { Button, Stack, ThemeProvider } from "@mui/material";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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

    console.log(_PEMdata);

    setPEMData(_PEMdata);
    setSMRData(_SMRdata);
  }, []);

  const GetDataCells = (dataSet: DataObj[]) =>
    dataSet.map((entry, index) => {
      const color = entry.subCategory === "CAPEX" ? COLORS[0] : COLORS[1];
      return <Cell fill={color} key={index} />;
    });

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
            <Bar dataKey="prevCost" stackId="a" fill="transparent" />
            <Bar dataKey="cost" name="Cost" stackId="a" fill="#f57c00">
              {file === "PEM" ? GetDataCells(PEMData) : GetDataCells(SMRData)}
            </Bar>
          </>
        ) : (
          <>
            <Bar dataKey="prevCarbonIntensity" stackId="a" fill="transparent" />
            <Bar
              dataKey="carbonIntensity"
              name="Carbon Intensity"
              stackId="a"
              fill="#388e3c"
            >
              {file === "PEM" ? GetDataCells(PEMData) : GetDataCells(SMRData)}
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
