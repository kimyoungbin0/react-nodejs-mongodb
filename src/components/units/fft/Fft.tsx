import React, { useState, useEffect, useRef } from "react";
import * as S from "./Fft.styles";
import CsvReader from "../../csvReader/CsvReader";
import AmpFft from "../../chart/ampFft";

import _ from "lodash";
import { addCommas, getRandomInt } from "../../../commons/libraries/utils";
import { getDateTime, setDateTime } from "../../../commons/libraries/date";
import { averageByColumn, getThresholdData, reduceMaxArray, roundArray } from "../../../commons/libraries/array";
import ModalBasic from "../../commons/modals/ModalBasic";
import { Button, ConfigProvider, DatePicker, InputNumber, Table } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import koKR from "antd/lib/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";
// import locale from "antd/es/date-picker/locale/ko_KR";

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

export default function FftPage() {
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
  const [leak, setLeak] = useState({ leak: 0, sensor: 0, distance: 0, time: "" });
  const [pauseCycle, setPauseCycle] = useState(-1);

  const [recent, setRecent] = useState([] as any);
  const [isViewAllHistory, setIsViewAllHistory] = useState(false);

  const msInputRef = useRef(null);
  const tvInputRef = useRef(null);
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);
  const scaleInputRef = useRef(null);
  const sectorTableRef = useRef(null);
  const leakTableRef = useRef(null);

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
        setRecent([]);
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

      if (recent.length === 1) {
        resetAverageData(cycle - 2);
        console.log("resetAverageData:", cycle - 2);
      }
    }
  }, ms);

  const resetAverageData = (firstLeak: number) => {
    console.log("resetAverageData:", firstLeak);
    const averageArr = roundArray(averageByColumn(waveData.slice(0, firstLeak)), 2);
    setAverageData(averageArr);
  };

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

    setAmpIndex(filteredIndexArr as never[]);
    setAmpData(filteredDataArr);
    setPlotCount(plotCount);

    return { thresholdData, min, max };
  };

  const setThresholdTable = (thresholdData: any) => {
    // maxIndex 발생 횟수 카운트
    if (cycle === 0) {
      tvTotalIndexCount = {};
      tvConIndCount = {};
    }

    thresholdData.forEach(({ maxIndex }: any) => {
      const index = maxIndex.toFixed(1);
      tvTotalIndexCount[index] = tvTotalIndexCount[index] ? tvTotalIndexCount[index] + 1 : 1;
      // Find and remove elements in indexCount2 that are not in the current thresholdData
      Object.keys(tvConIndCount).forEach((key) => {
        if (!thresholdData.some(({ maxIndex }: any) => maxIndex.toFixed(1) === key)) {
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

    // console.log(combinedCounts);

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
      const WARN_MSG = ["Warning", "Caution", "Danger"];
      let position = getRandomInt(1, 5);
      let warn = getRandomInt(0, 2);
      let time = getDateTime(cycle * ms);
      const duplicateCycle = recent.some((el: any) => el.cycle === cycle); // check if duplicate cycle exists
      if (!duplicateCycle) {
        // proceed only if there is no duplicate cycle
        recent.push({ cycle: cycle, time: time, position: position, activity: activity, warn: WARN_MSG[warn] });
        setRecent(recent);
        setLeak({ leak: position, sensor: 1, distance: 5, time: time });
      }
    } else {
      setLeak({ leak: 0, sensor: 0, distance: 0, time: "" });
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
    setCycle(cycle < 0 ? -1 : 0);
    setIsPause(true);
    setPauseCycle(0);
    setRecent([]);
  };

  const onClickPause = () => {
    if (!isPause) {
      setPauseCycle(cycle);
    } else {
      // console.log("pauseCycle: " + pauseCycle);
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
      setLeakStatus(cycle - 1);
    }
    setIsPause(true);
  };

  const onClickNext = () => {
    console.log("Next: " + cycle);
    if (cycle < cycles - 1) {
      setCycle((prev) => (prev % cycles) + 1);
      setCycleChartArr((cycle + 1) % cycles);
      setLeakStatus((cycle + 1) % cycles);
    }
    setIsPause(true);
  };

  const onChangeCycle = (cycle: number) => {
    setCycle(cycle);
    setCycleChartArr(cycle);
    if (!isPause) setIsPause(true);
  };

  const onClickRecent = (cycle: number) => {
    setIsPause(true);
    setCycle(cycle);
    setCycleChartArr(cycle);
    setLeakStatus(cycle);
  };

  const setLeakStatus = (cycle: number) => {
    // console.log(cycle);
    const selectedLeak = recent.find((el: any) => el.cycle === cycle);

    if (selectedLeak) {
      // do something with the found element, e.g. console.log(foundElement)
      setLeak({ leak: selectedLeak.position, sensor: 1, distance: 5, time: selectedLeak.time });
    } else {
      // handle the case when no element with cycle === n was found
    }
  };

  const onClickViewAllHistory = (event: any) => {
    setIsViewAllHistory(!isViewAllHistory);
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

  const columnsSector = [
    {
      title: "Sector",
      dataIndex: "sector",
      key: "sector",
    },
    {
      title: "Freq",
      dataIndex: "maxIndex",
      key: "maxIndex",
    },
    {
      title: "Max",
      dataIndex: "maxValue",
      key: "maxValue",
    },
    {
      title: "Avg",
      dataIndex: "maxAverage",
      key: "maxAverage",
    },
  ];

  const dataSector = threshold.map((data: any) => ({
    key: `${data.sector}-${data.maxValue}`,
    sector: data.sector,
    maxIndex: data.maxIndex,
    maxValue: data.maxValue,
    maxAverage: data.maxAverage,
  }));

  const columnsLeak = [
    {
      title: "Freq",
      dataIndex: "freq",
      key: "freq",
    },
    {
      title: "Total",
      dataIndex: "totalCnt",
      key: "totalCnt",
    },
    {
      title: "Seq",
      dataIndex: "conCnt",
      key: "conCnt",
    },
  ];

  const dataLeak = tvIndexTop.map(({ freq, totalCnt, conCnt }: { freq: number; totalCnt: number; conCnt: number }) => ({
    key: freq,
    freq,
    totalCnt,
    conCnt,
  }));

  return (
    <>
      <S.PageWrapper>
        <S.LeftWrapper>
          {cycle < 0 && <CsvReader handleResults={handleResults} />}
          <S.Wrapper>
            <S.CycleWrapper>
              cycle: {cycle} / cycles: {cycles} / plots: {addCommas(plotCount)}
            </S.CycleWrapper>
            <S.SettingWrapper>
              ms: <S.AntdInputNumber id={"ms"} type={"number"} size={"small"} defaultValue={ms} min={80} max={1000} ref={msInputRef} />
              tv: <S.AntdInputNumber id={"tv"} type={"number"} size={"small"} defaultValue={tv} min={0} max={100} ref={tvInputRef} />
              min: <S.AntdInputNumber id={"minFreq"} type={"number"} size={"small"} defaultValue={minFreq} min={0} max={100} ref={minInputRef} />
              max: <S.AntdInputNumber id={"maxFreq"} type={"number"} size={"small"} defaultValue={maxFreq} min={0} max={100} ref={maxInputRef} />
              1/scale: <S.AntdInputNumber id={"scale"} type={"number"} size={"small"} defaultValue={scale} min={1} max={8192} ref={scaleInputRef} />
              <S.ControlButton onClick={onClickApply}>Apply</S.ControlButton>
            </S.SettingWrapper>
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
              {((leak.sensor === 1 || leak.sensor >= 3) && (
                <S.SensorBlockLeak isPause={isPause} ms={`${ms || 1000}ms`}>
                  FlexMate Sensor 1
                </S.SensorBlockLeak>
              )) || <S.SensorBlock>FlexMate Sensor 1</S.SensorBlock>}

              {leak.leak > 0 && (
                <S.ThresholdBlock>
                  Pipe 1 Threshold Detection at {leak.time} | Sensor:
                  {leak.sensor < 3 ? leak.sensor : leak.sensor - 2} / Distance: {leak.distance}m
                </S.ThresholdBlock>
              )}

              {/* {(leak.sensor === 0 || leak.sensor === 1) && <S.SensorBlock>FlexMate Sensor 2</S.SensorBlock>}
              {(leak.sensor === 2 || leak.sensor >= 3) && <S.SensorBlockLeak>FlexMate Sensor 2</S.SensorBlockLeak>} */}
            </S.PipeWrapper>
          </S.Wrapper>
          <S.Wrapper>
            <S.TableWrapper>
              <Table
                columns={columnsSector}
                dataSource={dataSector}
                size="small"
                sticky={true}
                scroll={{ y: 150 }}
                style={{ width: "450px", minHeight: "150px" }}
                ref={sectorTableRef}
              />
            </S.TableWrapper>
            <S.TableWrapper>
              <Table
                columns={columnsLeak}
                dataSource={dataLeak}
                size="small"
                sticky={true}
                scroll={{ y: 150 }}
                style={{ width: "350px", minHeight: "150px" }}
                ref={leakTableRef}
              />
            </S.TableWrapper>
          </S.Wrapper>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.SectionTitleWrapper>
            <S.SectionTitle>Recent Activity</S.SectionTitle>
            <S.CalendarWrapper>
              <DatePicker defaultValue={dayjs(getDateTime(0), "YYYY-MM-DD")} size={"small"} allowClear={false} />
            </S.CalendarWrapper>
          </S.SectionTitleWrapper>

          <S.SectionRecentWrapper>
            {recent
              .slice()
              .reverse()
              .slice(0, isViewAllHistory ? undefined : 10)
              .map((el: any) => (
                <S.RecentWrapper key={el.cycle} id={el.cycle} onClick={() => onClickRecent(el.cycle)}>
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
                  <S.RecentWarnWrapper>
                    <S.RecentWarn>
                      <InfoCircleOutlined />
                    </S.RecentWarn>
                    <S.RecentWarn>{el.warn}</S.RecentWarn>
                  </S.RecentWarnWrapper>
                </S.RecentWrapper>
              ))}
          </S.SectionRecentWrapper>
          <S.RecentButtonWrapper>
            <Button type="primary" onClick={onClickViewAllHistory} style={{ width: "100%", height: "60px", margin: "10px 0", padding: "10px" }}>
              <S.ButtonText>
                {!isViewAllHistory && "View All Recent Activities"}
                {isViewAllHistory && "View Recent 10 Activities"}
              </S.ButtonText>
            </Button>
          </S.RecentButtonWrapper>
        </S.RightWrapper>
      </S.PageWrapper>
    </>
  );
}
