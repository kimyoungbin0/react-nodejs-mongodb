import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
// import Papa from "papaparse";
import styled from "@emotion/styled";
import AmpFft from "../chart/ampFft";
import { checkFileExists, ReadCsv } from "../../commons/libraries/file";
import { reduceArray } from "../../commons/libraries/array";
import { addCommas } from "../../commons/libraries/util";

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

export default function FftCsvReader() {
  const [cycle, setCycle] = useState(-1);
  const [cycles, setCycles] = useState(32);
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
        const folderPath = "/data/fft/";
        const filePrefix = "normal_fft_";
        // const filePrefix = "leak_fft_";

        for (let i = 1; i <= cycles; i++) {
          const fileNumber = i.toString().padStart(2, "0");
          const fileName = `${folderPath}${filePrefix}${fileNumber}.csv`;

          const isFileExist = await checkFileExists(fileName);
          if (isFileExist) {
            promises.push(ReadCsv(fileName));
          }
        }

        const results = await Promise.all(promises);

        return results;
      };

      const fetchData = async () => {
        const result = await fetchCsvData();

        setFftArr(result);
        setCycle(0);
        setCycles(result.length);
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
        setCycle((prev) => (prev + 1) % cycles);
      }
    },
    cycle === 0 ? 2500 : 1000
  );

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
    setCycleChartArr((cycle - 1) % cycles);
  };

  const onClickPause = () => {
    setIsPause(!isPause);
    setCycle(cycle);
  };

  const onClickPrev = () => {
    console.log("Prev: " + cycle);
    if (cycle > 0) {
      setCycle((prev) => (prev - 1) % cycles);
      setCycleChartArr((cycle - 1) % cycles);
    }
    setIsPause(true);
  };

  const onClickNext = () => {
    console.log("Next: " + cycle);
    if (cycle < cycles - 1) {
      setCycle((prev) => (prev % cycles) + 1);
      setCycleChartArr((cycle + 1) % cycles);
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
          cycle: {cycle} / cycles: {cycles} / plots: {addCommas(plotCount)}
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
                max={cycles - 1}
                value={cycle}
                onChange={(e) => {
                  setCycle(Number(e.target.value));
                  setCycleChartArr(Number(e.target.value) % cycles);
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
