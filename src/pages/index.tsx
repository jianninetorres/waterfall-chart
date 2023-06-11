import { HomeProps, ParseResults, buildDataObj } from "@/helpers";
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

  const [pemDataState, setPemDataState] = useState<string[][]>([]);
  const [smrDataState, setSmrDataState] = useState<string[][]>([]);
  const [file, setFile] = useState<"PEM" | "SMR">("PEM");
  const [view, setView] = useState<"cost" | "carbonIntensity">("cost");

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

    setPemDataState(pemData.data);
    setSmrDataState(smrData.data);
  }, []);

  const PEMdata = buildDataObj(pemDataState);
  const SMRdata = buildDataObj(smrDataState);

  return (
    <>
      <h1>Hydrogen Production</h1>
      <BarChart
        width={900}
        height={500}
        data={file === "PEM" ? PEMdata : SMRdata}
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
            <Bar dataKey="carbonIntensity" stackId="a" fill="transparent" />
            <Bar dataKey="cost" stackId="a" fill="#8884d8" />
          </>
        ) : (
          <>
            <Bar dataKey="cost" stackId="a" fill="transparent" />
            <Bar dataKey="carbonIntensity" stackId="a" fill="#82ca9d" />
          </>
        )}
      </BarChart>

      <div>
        <h2>Methods</h2>
        <div className="flex flex-col">
          <button
            onClick={() => setFile("PEM")}
            style={{ borderWidth: file === "PEM" ? "5px" : 0 }}
          >
            Polymer Electrolyte Membrane (PEM)
          </button>
          <button
            onClick={() => setFile("SMR")}
            style={{ borderWidth: file === "SMR" ? "5px" : 0 }}
          >
            Steam methane reforming (SMR)
          </button>
        </div>
      </div>

      <button
        onClick={() => setView("cost")}
        style={{ borderWidth: view === "cost" ? "5px" : 0 }}
      >
        Cost
      </button>
      <button
        onClick={() => setView("carbonIntensity")}
        style={{ borderWidth: view === "carbonIntensity" ? "5px" : 0 }}
      >
        Carbon Intensity
      </button>
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
