import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import Papa from "papaparse";
import styled from "@emotion/styled";
import AmpFft from "../chart/ampFft";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 800px;
  /* min-height: 600px; */
  border: 1px solid #cccccc;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-height: 350px;
  overflow: auto;
  border: 1px solid #cccccc;
`;

const CycleWrapper = styled.div`
  min-width: 350px;
  min-height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  /* border: 1px solid #cccccc; */
`;

const ControlWrapper = styled.div`
  min-width: 450px;
  min-height: 30px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  /* border: 1px solid #cccccc; */
`;

const ControlButton = styled.button`
  margin: 0 5px;
`;

async function ReadCsv(url: string) {
  const csvFilePath = url;
  const response = await fetch(csvFilePath);
  const reader = response.body?.getReader();
  const result = await reader?.read();
  const decoder = new TextDecoder("utf-8");
  const csvText = decoder.decode(result?.value);
  const parsedCsv = Papa.parse(csvText, {
    header: false,
    newline: "\n",
    fastMode: true,
    dynamicTyping: true,
  });
  return _.dropRight(_.drop(parsedCsv.data, 3), 1);
}

const reduceArray = (arr: any[], n: number) => {
  if (n <= 1) {
    // return _.take(arr, 1);
    return arr;
  }
  return _.filter(arr, (_, i) => (i + 1) % n === 0);
};

export default function FftCsvReader() {
  const [cycle, setCycle] = useState(-1);
  const [totalCycle, setTotalCycle] = useState(32);
  const [fftArr, setFftArr] = useState([] as any);
  const [isPause, setIsPause] = useState(true);
  const [plotCount, setPlotCount] = useState(0);
  const [waveData, setWaveData] = useState([] as any);
  const [offsetData, setOffsetData] = useState([] as any);
  const [waveIndex, setWaveIndex] = useState([] as any);
  const [isAmpChart, setIsAmpChart] = useState(false);
  const [ampIndex, setAmpIndex] = useState([] as any);
  const [ampData, setAmpData] = useState([] as any);
  const [minFreq, setMinFreq] = useState(0);
  const [maxFreq, setMaxFreq] = useState(100);
  const [scale, setScale] = useState(32);
  const [maxAmp, setMaxAmp] = useState({ freq: 0, amp: 0 });
  const [threshold, setThreshold] = useState([] as any);

  const useInterval = (callback: any, delay: any) => {
    // const savedCallback = useRef();
    const savedCallback = useRef<() => void>(() => {});

    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);

    useEffect(() => {
      const fetchCsvData = async () => {
        const promises: any[] = [];

        for (let i = 1; i <= totalCycle; i++) {
          const fileNumber = i.toString().padStart(2, "0");
          promises.push(ReadCsv(`/data/fft/normal_fft_${fileNumber}.csv`));
          // promises.push(ReadCsv(`/data/fft/leak_fft_${fileNumber}.csv`));
        }

        const results = await Promise.all(promises);

        return results;
      };

      const fetchData = async () => {
        const result = await fetchCsvData();

        setFftArr(result);
        setCycle(0);
        // setIsPause(false);
      };

      void fetchData();
    }, []);
  };

  useEffect(() => {
    setCycleChartArr(cycle);
  }, [cycle]);

  useInterval(
    () => {
      if (!isPause && cycle > -1) {
        setCycle((prev) => (prev + 1) % totalCycle);
      }
    },
    cycle === 0 ? 2500 : 1000
  );

  // const setCycleChartArr = (cycle: number) => {
  //   console.log("cycle: " + cycle);
  //   const ampIndexArr = reduceArray(_.unzip(fftArr[cycle])[0], scale);
  //   const amdDataArr = reduceArray(_.unzip(fftArr[cycle])[1], scale);
  //   const plotCount = ampIndexArr.length;
  //   // console.log(amdDataArr);
  //   setAmpIndex(ampIndexArr);
  //   setAmpData(amdDataArr);
  //   setPlotCount(plotCount);
  // };

  const setCycleChartArr = (cycle: number) => {
    const ampIndexArr = reduceArray(_.unzip(fftArr[cycle])[0], scale);
    const amdDataArr = reduceArray(_.unzip(fftArr[cycle])[1], scale);
    const startIdx = ampIndexArr.findIndex((freq) => freq >= minFreq);
    const endIdx = ampIndexArr.reduce((prev, curr, idx) => {
      if (curr <= maxFreq) {
        return idx;
      }
      return prev;
    }, startIdx);
    const filteredIndexArr = ampIndexArr.slice(startIdx, endIdx + 1);
    const filteredDataARr = amdDataArr.slice(startIdx, endIdx + 1);

    const plotCount = filteredIndexArr.length;

    setAmpIndex(filteredIndexArr);
    setAmpData(filteredDataARr);
    setPlotCount(plotCount);
  };

  const onChangeMaxFreq = (event: any) => {
    setMaxFreq(event.target.value);
  };

  const onChangeScale = (event: any) => {
    setScale(Math.floor(event.target.value));
  };

  const onClickApply = () => {
    const minFreqInputElement = document.getElementById(
      "minFreq"
    ) as HTMLInputElement;
    const maxFreqInputElement = document.getElementById(
      "maxFreq"
    ) as HTMLInputElement;
    const scaleInputElement = document.getElementById(
      "scale"
    ) as HTMLInputElement;
    const minFreq = parseInt(minFreqInputElement?.value || "0");
    const maxFreq = parseInt(maxFreqInputElement?.value || "0");
    const scale = Math.floor(parseFloat(scaleInputElement?.value || "0"));
    setMinFreq(minFreq);
    setMaxFreq(maxFreq);
    setScale(scale);
    setCycleChartArr((cycle - 1) % totalCycle);
  };

  const onClickPause = () => {
    setIsPause(!isPause);
    setCycle(cycle);
  };

  const onClickPrev = () => {
    console.log("Prev: " + cycle);
    if (cycle > 0) {
      setCycle((prev) => (prev - 1) % totalCycle);
      setCycleChartArr((cycle - 1) % totalCycle);
    }
    setIsPause(true);
  };

  const onClickNext = () => {
    console.log("Next: " + cycle);
    if (cycle < totalCycle - 1) {
      setCycle((prev) => (prev % totalCycle) + 1);
      setCycleChartArr((cycle + 1) % totalCycle);
    }
    setIsPause(true);
  };

  const onClickWarn = (event: any) => {
    setIsPause(true);
    setCycle(event.currentTarget.id);
  };

  return (
    <>
      <Wrapper>
        <CycleWrapper>
          cycle: {cycle} / totalCycle: {totalCycle} / count: {plotCount}
        </CycleWrapper>
        <ControlWrapper>
          minFreq:{" "}
          <input
            id="minFreq"
            type="number"
            min={0}
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={minFreq}
            // onChange={onChangeMaxFreq}
          />{" "}
          maxFreq:{" "}
          <input
            id="maxFreq"
            type="number"
            min={0}
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={maxFreq}
            // onChange={onChangeMaxFreq}
          />{" "}
          1/scale:{" "}
          <input
            id="scale"
            type="number"
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={scale}
            // onChange={onChangeScale}
          />
          <ControlButton onClick={onClickApply}>Apply</ControlButton>
        </ControlWrapper>
      </Wrapper>
      <Wrapper>
        <ChartWrapper>
          <AmpFft index={ampIndex} count={cycle} plots={ampData} />
          {cycle > -1 && (
            <ControlWrapper>
              <input
                type="range"
                min="0"
                max={totalCycle - 1}
                value={cycle}
                onChange={(e) => {
                  setCycle(Number(e.target.value));
                  setCycleChartArr(Number(e.target.value) % totalCycle);
                }}
                style={{ width: "100%" }}
              />
            </ControlWrapper>
          )}
          <ControlWrapper>
            {cycle > -1 && !isPause && (
              <ControlButton onClick={onClickPause}>Pause</ControlButton>
            )}
            {cycle > -1 && isPause && (
              <ControlButton onClick={onClickPause}>Resume</ControlButton>
            )}
            {cycle > -1 && isPause && (
              <ControlButton onClick={onClickPrev}>Prev</ControlButton>
            )}
            {cycle > -1 && isPause && (
              <ControlButton onClick={onClickNext}>Next</ControlButton>
            )}
          </ControlWrapper>
        </ChartWrapper>
      </Wrapper>
    </>
  );
}
