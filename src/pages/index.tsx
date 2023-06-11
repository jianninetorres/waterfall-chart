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

const Home = ({ pem, smr }) => {
  const { readString } = usePapaParse();

  const [pemDataState, setPemDataState] = useState([]);
  const [smrDataState, setSmrDataState] = useState([]);
  const [file, setFile] = useState("PEM");
  const [view, setView] = useState<"cost" | "carbonIntensity">("cost");

  useEffect(() => {
    const getPEMData = () =>
      readString(pem, {
        complete: (results) => {
          console.log("---------------------------");
          console.log("Results:", results.data);
          console.log("---------------------------");
        },
      });

    const getSMRData = () =>
      readString(smr, {
        complete: (results) => {
          console.log("---------------------------");
          console.log("Results:", results);
          console.log("---------------------------");
        },
      });

    const pemData = getPEMData();
    const smrData = getSMRData();

    pemData.data.shift();
    smrData.data.shift();
    console.log(pemData.data);
    console.log(smrData.data);

    setPemDataState(pemData.data);
    setSmrDataState(smrData.data);
  }, []);

  const processedPEM = pemDataState.map((item) => {
    return {
      name: item[0],
      subCategory: item[1],
      cost: Number(item[2]),
      carbonIntensity: Number(item[3]),
    };
  });

  const processedSMR = smrDataState.map((item, index) => {
    const prev = smrDataState[index - 1];
    console.log(prev);
    return {
      name: item[0],
      subCategory: item[1],
      cost: Number(item[2]),
      carbonIntensity: Number(item[3]),
    };
  });

  console.log(processedPEM);

  const getCumulativeCostValue = (category: string) => {
    const cumulativeCost = processedPEM
      .filter((item: { name: string }) => item.name === category)
      .reduce((acc, curr) => acc + curr.cost, 0);

    console.log(cumulativeCost);

    return cumulativeCost;
  };

  const getCumulativeCarbonIntensityValue = (category: string) => {
    const cumulativeValue = processedPEM
      .filter((item: { name: string }) => item.name === category)
      .reduce((acc, curr) => acc + curr.cost, 0);

    console.log(cumulativeValue);

    return cumulativeValue;
  };

  console.log(getCumulativeCostValue("Grid power"));
  console.log(getCumulativeCostValue("Reformer"));

  const PEMCumulativeCosts = pemDataState.map((item) => {
    return {
      name: item[0],
      subCategory: item[1],
      cost: getCumulativeCostValue(item[0]),
      carbonIntensity: getCumulativeCarbonIntensityValue(item[0]),
    };
  });

  const finalCumulativeCosts = {};

  console.log(PEMCumulativeCosts);

  PEMCumulativeCosts.forEach((item) => {
    if (!finalCumulativeCosts.hasOwnProperty(item.name)) {
      finalCumulativeCosts[item.name] = {
        [item.subCategory]: {
          cost: item.cost,
          carbonIntensity: item.carbonIntensity,
        },
      };
    } else if (!finalCumulativeCosts[item.name][item.subCategory]) {
      finalCumulativeCosts[item.name][item.subCategory] = {
        cost: item.cost,
        carbonIntensity: item.carbonIntensity,
      };
    }
  });

  console.log(finalCumulativeCosts);
  const _final = Object.entries(finalCumulativeCosts).map(([k, v]) => ({
    [k]: v,
  }));

  console.log(_final);

  return (
    <>
      <h1>Home</h1>
      <BarChart
        width={900}
        height={500}
        data={file === "PEM" ? processedPEM : processedSMR}
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

      <button
        onClick={() => setFile("PEM")}
        style={{ borderWidth: file === "PEM" ? "5px" : 0 }}
      >
        PEM
      </button>
      <button
        onClick={() => setFile("SMR")}
        style={{ borderWidth: file === "SMR" ? "5px" : 0 }}
      >
        SMR
      </button>
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
