import "../app/globals.css";

import { MethodsList, ViewOptions, buildDataObj, inter } from "@/helpers";
import { DataObj, HomeProps, ParseResults } from "@/interfaces";
import { Methods, View } from "@/types";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { usePapaParse } from "react-papaparse";
import WaterfallChart from "@/components/WaterfallChart";
import Options from "@/components/Options";

const Home = ({ pem, smr }: HomeProps) => {
  const { readString } = usePapaParse();

  const [PEMData, setPEMData] = useState<DataObj[]>([]);
  const [SMRData, setSMRData] = useState<DataObj[]>([]);
  const [method, setMethod] = useState<Methods>("pem");
  const [view, setView] = useState<View>("cost");

  useEffect(() => {
    const getData = (data: string) =>
      readString(data, {
        complete: (results) => {
          console.log("---------------------------");
          console.log("Results:", results);
          console.log("---------------------------");
        },
        // @ts-ignore
        worker: false,
      }) as unknown as ParseResults;

    const pemData = getData(pem);
    const smrData = getData(smr);

    if (pemData && smrData) {
      pemData.data.shift();
      smrData.data.shift();

      const _PEMdata = buildDataObj(pemData?.data);
      const _SMRdata = buildDataObj(smrData?.data);

      setPEMData(_PEMdata);
      setSMRData(_SMRdata);
    }
  }, []);

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
          <Options
            title="Methods"
            value={method}
            list={MethodsList}
            onChangeHandler={setMethod}
          />
        </Stack>
        <Stack spacing={2} width={200}>
          <Options
            title="Views"
            value={view}
            list={ViewOptions}
            onChangeHandler={setView}
          />
        </Stack>
      </Stack>
      <Stack direction="column">
        <h1>Hydrogen Production</h1>
        <WaterfallChart
          view={view}
          method={method}
          data={{ pem: PEMData, smr: SMRData }}
        />
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
