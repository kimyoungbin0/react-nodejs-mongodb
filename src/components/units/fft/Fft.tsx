import React, { useState, useEffect, useRef } from "react";
import * as S from "./Fft.styles";
import CsvReader from "../../csvReader/CsvReader";
import AmpFft from "../../chart/ampFft";

import _ from "lodash";
import { addCommas, getRandomInt } from "../../../commons/libraries/utils";
import { getDateTime, setDateTime } from "../../../commons/libraries/date";
import { averageByColumn, getThresholdData, reduceMaxArray, roundArray } from "../../../commons/libraries/array";
import ModalBasic from "../../commons/modals/ModalBasic";

function useInterval(callback: any, delay: any) {
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

let tvTotalIndexCount: any = {};
let tvConIndCount: any = {};
let prevThresholdData: any = {};
// let pauseCycle: number = -1;

export default function FftOsCsvReader() {
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
  const [ms, setMs] = useState(1000);

  const [threshold, setThreshold] = useState([] as any);
  const [minY, setMinY] = useState(-100);
  const [maxY, setMaxY] = useState(100);

  const [startDate, setStartDate] = useState("");
  const [leak, setLeak] = useState({ leak: 0, sensor: 0, distance: 0, time: "" });
  const [pauseCycle, setPauseCycle] = useState(-1);

  const [recent, setRecent] = useState([] as any);

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
      setCycleChartArr(cycle);

      // const temp = getTdAmp(waveData[cycle % cycles]);
      // setAmpIndex(temp.frequencies);
      // setAmpData(temp.fdAmp);
      if (cycle + 1 < cycles) {
        setCycle((prev) => (prev + 1) % cycles);
      } else {
        setIsPause(true);
        setPauseCycle(0);
      }
      // checkLeak((cycle + 1) % cycles);
    }
  }, ms);

  const setCycleChartArr = (cycle: number) => {
    if (cycle > -1) {
      const thresholdData = setThresholdData();

      if (!isPause) {
        setThresholdTable(thresholdData.thresholdData);
      }

      setChartMinMax(thresholdData.min, thresholdData.max);
    }
  };

  const setThresholdData = () => {
    const ampMaxArray = reduceMaxArray(waveIndex, waveData[cycle], averageData, scale);
    const ampIndexArr = ampMaxArray.maxIndexArray;
    const ampDataArr = ampMaxArray.maxDataArray;
    const ampAverageArr = ampMaxArray.maxAverageArray;

    // console.log("ampAverageArr", ampAverageArr);

    const startIdx = ampIndexArr.findIndex((freq: any) => freq >= minFreq);
    const endIdx = ampIndexArr.reduce((prev: any, curr: any, idx: any) => {
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

    const thresholdData = getThresholdData(chunkedFilteredIndexArr, chunkedFilteredDataArr, chunkedFilteredAverageArr, Number(tv));

    const min = Math.floor(Math.min(...filteredDataArr) / 10) * 10;
    const max = (Math.floor(Math.max(...filteredDataArr) / 10) + 1) * 10;

    setThreshold(thresholdData);

    setAmpIndex(filteredIndexArr);
    setAmpData(filteredDataArr);
    setPlotCount(plotCount);

    return { thresholdData, min, max };
  };

  const setThresholdTable = (thresholdData: any) => {
    // TODO leak 연속 발생 횟수 카운트
    // indexCount2

    // maxIndex 발생 횟수 카운트
    if (cycle === 0) {
      tvTotalIndexCount = {};
      tvConIndCount = {};
    }

    thresholdData.forEach(({ maxIndex }) => {
      const index = maxIndex.toFixed(1);
      tvTotalIndexCount[index] = tvTotalIndexCount[index] ? tvTotalIndexCount[index] + 1 : 1;
      // Find and remove elements in indexCount2 that are not in the current thresholdData
      Object.keys(tvConIndCount).forEach((key) => {
        if (!thresholdData.some(({ maxIndex }) => maxIndex.toFixed(1) === key)) {
          delete tvConIndCount[key];
        }
      });
      tvConIndCount[index] = (tvConIndCount[index] || 0) + 1;
    });
    prevThresholdData = JSON.parse(JSON.stringify(thresholdData));

    const combinedCounts = [];
    for (const index in tvTotalIndexCount) {
      combinedCounts.push({
        freq: index,
        totalCnt: tvTotalIndexCount[index],
        conCnt: tvConIndCount[index] || 0,
      });
    }

    for (const index in tvConIndCount) {
      if (!(index in tvTotalIndexCount)) {
        combinedCounts.push({
          freq: index,
          totalCnt: 0,
          conCnt: tvConIndCount[index],
        });
      }
    }

    console.log(combinedCounts);

    const filteredCounts = combinedCounts;
    const sorted = filteredCounts.sort((a, b) => b.totalCnt - a.totalCnt);
    setTvIndexTop(sorted);

    let activity = "";
    for (const count of sorted) {
      if (count.conCnt >= 3) {
        activity += `${count.freq}, `;
      }
    }
    activity = activity.slice(0, -2); // remove trailing comma and space

    if (activity) {
      let position = getRandomInt(1, 5);
      let time = getDateTime(cycle * 1000);
      recent.push({ cycle: cycle, time: time, position: position, activity: activity });

      setRecent(recent);
      setLeak({ leak: position, sensor: 0, distance: 5, time: time });
    } else {
      setLeak({});
    }
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
    reset();
  };

  const reset = () => {
    const msInputElement = document.getElementById("ms") as HTMLInputElement;
    const tvInputElement = document.getElementById("tv") as HTMLInputElement;
    const minFreqInputElement = document.getElementById("minFreq") as HTMLInputElement;
    const maxFreqInputElement = document.getElementById("maxFreq") as HTMLInputElement;
    const scaleInputElement = document.getElementById("scale") as HTMLInputElement;
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

    tvTotalIndexCount = {};
    setTvIndexTop([]);
    setThresholdTable([]);
    setCycle(0);

    setRecent([]);
  };

  const onClickPause = () => {
    if (!isPause) {
      setPauseCycle(cycle);
    } else {
      console.log("pauseCycle: " + pauseCycle);
      setCycle(pauseCycle);
      setCycleChartArr(pauseCycle);
    }
    // console.log("pauseCycle: " + pauseCycle);
    setIsPause(!isPause);
    // setCycle(cycle);
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

  const onChangeCycle = (cycle: number) => {
    setCycle(cycle);
    setCycleChartArr(cycle);
    if (!isPause) setIsPause(true);
  };

  const handleResults = (results: any) => {
    setWaveIndex([]);
    setWaveData([]);
    setAverageData([]);
    const csvData = chunk(_.dropRight(results));
    let indexData = csvData.indexData;
    let chunkedData = csvData.offsetData;
    let averageData = csvData.averageData;
    // console.log(indexData);
    // console.log(chunkedData);
    // console.log(averageData);

    setWaveIndex(indexData);
    // const adjustedData = subtractArrays(chunkedData, averageData, 2);
    setAverageData(averageData);
    setWaveData(chunkedData);
    setCycles(chunkedData.length);

    setCycle(0);
    setIsPause(false);
  };

  return (
    <>
      <S.PageWrapper>
        <S.LeftWrapper>
          {cycle < 0 && <CsvReader handleResults={handleResults} />}
          <S.Wrapper>
            <S.CycleWrapper>
              cycle: {cycle} / cycles: {cycles} / plots: {addCommas(plotCount)}
            </S.CycleWrapper>
            <S.ControlWrapper>
              ms: <S.NumberInput id={"ms"} type={"number"} defaultValue={ms} />
              tv: <S.NumberInput id={"tv"} type={"number"} defaultValue={tv} />
              min: <S.NumberInput id={"minFreq"} type={"number"} defaultValue={minFreq} />
              max: <S.NumberInput id={"maxFreq"} type={"number"} defaultValue={maxFreq} />
              1/scale: <S.NumberInput id={"scale"} type={"number"} defaultValue={scale} />
              <S.ControlButton onClick={onClickApply}>Apply</S.ControlButton>
            </S.ControlWrapper>
          </S.Wrapper>
          <S.Wrapper>
            <S.ChartWrapper>
              <AmpFft index={ampIndex} count={cycle} plots={ampData} tv={tv} minY={minY} maxY={maxY} />
              {cycle > -1 && (
                <S.ControlWrapper>
                  <S.RangeInput
                    id="cycleRange"
                    type="range"
                    max={cycles - 1}
                    value={cycle}
                    onChange={(e) => {
                      onChangeCycle(Number(e.target.value));
                    }}
                  />
                </S.ControlWrapper>
              )}
              <S.ControlWrapper>
                {cycle > -1 && !isPause && <S.ControlButton onClick={onClickPause}>Pause</S.ControlButton>}
                {cycle > -1 && isPause && (
                  <>
                    <S.ControlButton onClick={onClickPause}>Resume</S.ControlButton>
                    <S.ControlButton onClick={onClickPrev}>Prev</S.ControlButton>
                    <S.ControlButton onClick={onClickNext}>Next</S.ControlButton>
                  </>
                )}
              </S.ControlWrapper>
            </S.ChartWrapper>
          </S.Wrapper>
          <S.Wrapper>
            <S.PipeWrapper>
              {(() => {
                const blocks = [];
                for (let i = 1; i <= 5; i++) {
                  if (leak.leak === i) {
                    blocks.push(<S.PipeBlockLeak key={i}>{i}</S.PipeBlockLeak>);
                  } else {
                    blocks.push(<S.PipeBlock key={i}>{i}</S.PipeBlock>);
                  }
                }
                return blocks;
              })()}
            </S.PipeWrapper>
          </S.Wrapper>
          <S.Wrapper>
            <S.PipeWrapper style={{ justifyContent: "space-between" }}>
              {(leak.sensor === 0 || leak.sensor === 2) && <S.SensorBlock>FlexMate Sensor 1</S.SensorBlock>}
              {(leak.sensor === 1 || leak.sensor >= 3) && <S.SensorBlockLeak>FlexMate Sensor 1</S.SensorBlockLeak>}

              {leak.leak > 0 && (
                <S.ThresholdBlock>
                  Pipe 1 Threshold Detection at {leak.time} | Sensor:
                  {leak.sensor < 3 ? leak.sensor : leak.sensor - 2} / Distance: {leak.distance}m
                </S.ThresholdBlock>
              )}

              {(leak.sensor === 0 || leak.sensor === 1) && <S.SensorBlock>FlexMate Sensor 2</S.SensorBlock>}
              {(leak.sensor === 2 || leak.sensor >= 3) && <S.SensorBlockLeak>FlexMate Sensor 2</S.SensorBlockLeak>}
            </S.PipeWrapper>
          </S.Wrapper>
          <S.Wrapper>
            <S.TableWrapper>
              <table>
                <thead>
                  <tr>
                    <th>Sector</th>
                    <th>MaxIndex</th>
                    <th>MaxValue</th>
                    <th>MaxAverage</th>
                  </tr>
                </thead>
                <tbody>
                  {cycle > -1 &&
                    threshold.map((data: any) => (
                      <tr key={`${data.sector}-${data.maxValue}`}>
                        <td>{data.sector}</td>
                        <td>{data.maxIndex}</td>
                        <td>{data.maxValue}</td>
                        <td>{data.maxAverage}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </S.TableWrapper>
            <S.TableWrapper>
              <table>
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Total</th>
                    <th>Continue</th>
                  </tr>
                </thead>
                <tbody>
                  {cycle > -1 &&
                    tvIndexTop.map(({ freq, totalCnt, conCnt }) => {
                      return (
                        <tr key={freq}>
                          <td>{freq}</td>
                          <td>{totalCnt}</td>
                          <td>{conCnt}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </S.TableWrapper>
          </S.Wrapper>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.SectionTitleWrapper>
            <S.SectionTitle>Recent Activity</S.SectionTitle>
          </S.SectionTitleWrapper>

          {recent
            .slice()
            .reverse()
            .slice(0, 10)
            .map((el) => (
              <S.RecentWrapper key={el.cycle}>
                <S.RecentItemWrapper>
                  <S.LeakPositionWrapper>
                    <S.LeakPosition>{el.position}</S.LeakPosition>
                  </S.LeakPositionWrapper>
                </S.RecentItemWrapper>
                <S.RecentItemWrapper>
                  <div>
                    {" "}
                    <div>
                      <S.RecentType>Leak Detected [{el.time}]</S.RecentType>
                    </div>
                    <div>
                      <S.RecentItem>
                        Cycle: {el.cycle} / {el.activity} KHz
                      </S.RecentItem>
                    </div>
                  </div>
                </S.RecentItemWrapper>
              </S.RecentWrapper>
            ))}
        </S.RightWrapper>
      </S.PageWrapper>
    </>
  );
}