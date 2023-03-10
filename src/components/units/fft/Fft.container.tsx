import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import { getDateTime, setDateTime } from "../../../commons/libraries/date";
import {
  averageByColumn,
  getThresholdData,
  reduceMaxArray,
  roundArray,
  subtractArrays,
} from "../../../commons/libraries/array";
import FftUI from "./Fft.presenter";
import CsvReader from "../../csvReader/CsvReader";

function useInterval(callback: any, delay: any) {
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
}

let myProps = {};
let indexCount: { [index: number]: number } = {};

export default function Fft() {
  const [cycle, setCycle] = useState(-1);
  const [cycles, setCycles] = useState(0);
  const [isPause, setIsPause] = useState(true);
  const [plotCount, setPlotCount] = useState(0);
  const [waveData, setWaveData] = useState([] as any);
  const [waveIndex, setWaveIndex] = useState([] as any);
  const [averageData, setAverageData] = useState([] as any);
  const [ampIndex, setAmpIndex] = useState([]);
  const [ampData, setAmpData] = useState([] as any);
  const [minFreq, setMinFreq] = useState(0);
  const [maxFreq, setMaxFreq] = useState(100);
  const [scale, setScale] = useState(32);
  const [tv, setTv] = useState(15);
  const [tvIndexTop, setTvIndexTop] = useState([] as any);
  const [ms, setMs] = useState(100);

  const [threshold, setThreshold] = useState([] as any);
  const [minY, setMinY] = useState(-100);
  const [maxY, setMaxY] = useState(100);

  const [startDate, setStartDate] = useState("");
  // const [leak, setLeak] = useState(0);
  const [leak, setLeak] = useState({ leak: 0, sensor: 0, distance: 0 });

  const chunk = (data: any[]) => {
    const dataCount = data[0].length;
    const unzipIndex = _.unzip(data)[0];
    const maxIndex: number = unzipIndex.length;
    const plotCount = maxIndex;
    setPlotCount(plotCount);

    const indexData = unzipIndex;

    let offsetArr = new Array();
    for (let i = 1; i < dataCount; i++) {
      const unzipData = _.unzip(data)[i];
      offsetArr.push(unzipData);
    }

    const averageArr = roundArray(averageByColumn(offsetArr.slice(0, 20)), 2);
    // const averageArr = roundArray(averageByColumn(offsetArr), 2);

    return { indexData, offsetData: offsetArr, averageData: averageArr };
  };

  useInterval(() => {
    if (!isPause && cycle > -1) {
      if (cycle === 0) {
        setDateTime();
        setStartDate(getDateTime(0));
      }

      if (cycle + 1 < cycles) {
        setCycle((prev) => (prev + 1) % cycles);
      } else {
        setIsPause(true);
      }
    }
  }, ms);

  useEffect(() => {
    setCycleChartArr(cycle);

    myProps = {
      cycle,
      isPause,
      cycles,
      plotCount,
      ms,
      tv,
      minFreq,
      maxFreq,
      scale,
      ampIndex,
      ampData,
      minY,
      maxY,
      threshold,
      tvIndexTop,
      onClickApply,
      onClickPause,
    };
  }, [cycle]);

  const handleResults = (results: any) => {
    console.log(results);
    setCycle(0);
    setIsPause(false);
    setWaveIndex([]);
    setWaveData([]);
    setAverageData([]);
    const csvData = chunk(_.dropRight(results));
    let indexData = csvData.indexData;
    let chunkedData = csvData.offsetData;
    let averageData = csvData.averageData;
    console.log(indexData);
    console.log(chunkedData);
    console.log(averageData);

    setWaveIndex(indexData);
    const adjustedData = subtractArrays(chunkedData, averageData, 2);
    setAverageData(averageData);
    setWaveData(chunkedData);
    setCycles(chunkedData.length);
  };

  const setCycleChartArr = (cycle: number) => {
    if (cycle < 0) return;

    const thresholdData = setThresholdData();

    if (!isPause) {
      setThresholdTable(thresholdData.thresholdData);
    }

    setChartMinMax(thresholdData.min, thresholdData.max);
  };

  const setThresholdData = () => {
    const ampMaxArray = reduceMaxArray(
      waveIndex,
      waveData[cycle],
      averageData,
      scale
    );
    const ampIndexArr = ampMaxArray.maxIndexArray;
    const ampDataArr = ampMaxArray.maxDataArray;
    const ampAverageArr = ampMaxArray.maxAverageArray;

    // console.log("ampAverageArr", ampAverageArr);

    const startIdx = ampIndexArr.findIndex((freq) => freq >= minFreq);
    const endIdx = ampIndexArr.reduce((prev, curr, idx) => {
      if (curr <= maxFreq) {
        return idx;
      }
      return prev;
    }, startIdx);
    const filteredIndexArr = ampIndexArr.slice(startIdx, endIdx + 1);
    const filteredDataArr = ampDataArr.slice(startIdx, endIdx + 1);
    const filteredAverageArr = ampAverageArr.slice(startIdx, endIdx + 1);

    const plotCount = filteredIndexArr.length;

    const sectionCount = 20;
    const chunkedCount = Math.ceil(plotCount / sectionCount);

    const chunkedFilteredIndexArr = _.chunk(filteredIndexArr, chunkedCount);
    const chunkedFilteredDataArr = _.chunk(filteredDataArr, chunkedCount);
    const chunkedFilteredAverageArr = _.chunk(filteredAverageArr, chunkedCount);

    const thresholdData = getThresholdData(
      chunkedFilteredIndexArr,
      chunkedFilteredDataArr,
      chunkedFilteredAverageArr,
      Number(tv)
    );

    const min = Math.floor(Math.min(...filteredDataArr) / 10) * 10;
    const max = (Math.floor(Math.max(...filteredDataArr) / 10) + 1) * 10;

    setThreshold(thresholdData);

    setAmpIndex(filteredIndexArr);
    setAmpData(filteredDataArr);
    setPlotCount(plotCount);

    return { thresholdData, min, max };
  };

  const setThresholdTable = (thresholdData: any) => {
    // maxIndex 발생 횟수 카운트
    if (cycle === 0) {
      indexCount = {};
    }
    thresholdData.forEach(({ maxIndex }) => {
      const index = maxIndex.toFixed(1);
      indexCount[index] = indexCount[index] ? indexCount[index] + 1 : 1;
    });
    // setTvIndexCount(indexCount);
    // console.log(indexCount);

    const sorted = Object.entries(indexCount).sort((a, b) => b[1] - a[1]);
    // .slice(0, 10);
    setTvIndexTop(sorted);
    // console.log(sorted);
  };

  const setChartMinMax = (min: number, max: number) => {
    if (cycle === 0) {
      setMinY(min);
      setMaxY(max);
    } else {
      if (min < minY) {
        setMinY(min);
      }
      if (max > maxY) {
        setMaxY(max);
      }
    }
  };

  const onClickApply = () => {
    const msInputElement = document.getElementById("ms") as HTMLInputElement;
    const tvInputElement = document.getElementById("tv") as HTMLInputElement;
    const minFreqInputElement = document.getElementById(
      "minFreq"
    ) as HTMLInputElement;
    const maxFreqInputElement = document.getElementById(
      "maxFreq"
    ) as HTMLInputElement;
    const scaleInputElement = document.getElementById(
      "scale"
    ) as HTMLInputElement;
    const ms = parseInt(msInputElement?.value || "0");
    const tv = parseInt(tvInputElement?.value || "0");
    const minFreq = parseInt(minFreqInputElement?.value || "0");
    const maxFreq = parseInt(maxFreqInputElement?.value || "0");
    const scale = Math.floor(parseFloat(scaleInputElement?.value || "0"));
    setMs(ms);
    setTv(tv);
    setMinFreq(minFreq);
    setMaxFreq(maxFreq);
    setScale(scale);

    if (cycle > -1) setCycleChartArr((cycle - 1) % cycles);

    indexCount = {};
    setTvIndexTop([]);
    setThresholdTable([]);
    setCycle(0);
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

  return (
    <>
      <CsvReader handleResults={handleResults} />
      <FftUI {...myProps} />
    </>
  );
}
