import React, { useState, useEffect, useRef } from "react";
import * as S from "./Fft.styles";
import CsvReader from "../../csvReader/CsvReader";
import AmpFft from "../../chart/ampFft";

import _, { set } from "lodash";
import { addCommas, getRandomInt } from "../../../commons/libraries/utils";
import { getDateTime, setDateTime } from "../../../commons/libraries/date";
import { averageByColumn, textToNumArray, getThresholdData, reduceMaxArray, roundArray } from "../../../commons/libraries/array";
import { Button, ConfigProvider, DatePicker, InputNumber, Select, Space, Table } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/ko";
// import locale from "antd/es/date-picker/locale/ko_KR";

import { calculateMeanFrequency, calculatePeakFrequency } from "../../../commons/libraries/flexreal";

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
  const [minFreq, setMinFreq] = useState(20);
  const [maxFreq, setMaxFreq] = useState(50);
  const [scale, setScale] = useState(32);
  const [tv, setTv] = useState(13);
  const [tvIndexTop, setTvIndexTop] = useState([] as any);
  const [ms, setMs] = useState(100);
  const [vCycle, setVCycle] = useState(100);

  // mean, peak frequency data state
  const [meanFreq, setMeanFreq] = useState<number[]>([]);
  const [peakFreq, setPeakFreq] = useState<number[]>([]);
  const [vStartFreq, setVStartFreq] = useState(0);
  const [vEndFreq, setVEndFreq] = useState(0);
  const [vMeanFreq, setVMeanFreq] = useState<number[]>([]);
  const [vPeakFreq, setVPeakFreq] = useState<number[]>([]);

  const [threshold, setThreshold] = useState([] as any);
  const [minY, setMinY] = useState(-100);
  const [maxY, setMaxY] = useState(100);

  const [startDate, setStartDate] = useState("");
  const [leak, setLeak] = useState({ leak: 0, sensor: 0, distance: 0, time: "" });
  const [pauseCycle, setPauseCycle] = useState(-1);

  const [isRecent, setIsRecent] = useState(false);
  const [recent, setRecent] = useState([] as any);
  const [recentCnt, setRecentCnt] = useState(10);
  // const [isViewAllHistory, setIsViewAllHistory] = useState(false);

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

    const averageArr = setAvgData(offsetArr, 40);

    return { indexData, offsetData: offsetArr, averageData: averageArr };
  };

  useInterval(() => {
    if ((!isPause && cycle > -1) || isRecent) {
      if (cycle === 0) {
        setDateTime();
        setStartDate(getDateTime(0));
        setRecent([]);
      }
      setCycleChartArr(cycle);

      if (!isRecent) {
        if (cycle + 1 < cycles) {
          setCycle((prev) => (prev + 1) % cycles);
        } else {
          setIsPause(true);
          setPauseCycle(cycles - 1);
        }
      }

      setIsRecent(false);
    }
  }, ms);

  const setAvgData = (data: any[], leakPoint: number) => {
    console.log("resetAverageData:", leakPoint);
    const averageData = roundArray(averageByColumn(data.slice(0, leakPoint)), 2);
    return averageData;
    // setAverageData(averageArr);
  };

  const setCycleChartArr = (cycle: number) => {
    if (cycle > -1) {
      const thresholdData = setThresholdData();

      // TODO: Recent를 Click시, Prev, Next 버튼으로 Click시 업데이트될 수 있도록 수정
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

    // insertDB(cycle, filteredDataArr);

    if (!isPause && !isRecent) {
      const meanFrequency = calculateMeanFrequency(filteredIndexArr, filteredDataArr);
      setMeanFreq((prev: any) => [...prev, meanFrequency]);
      setVMeanFreq(meanFreq);

      const peakFrequency = calculatePeakFrequency(filteredDataArr, plotCount * 100);
      setPeakFreq((prev: any) => [...prev, peakFrequency]);
      setVPeakFreq(peakFreq);
    } else {
      // console.log("meanFreq:", meanFreq);

      // TODO: cycle 수동 조작시 meanFreq, peakFreq 업데이트 부분 수정 필요
      if (cycle <= pauseCycle) {
        const startIndex = Math.max(cycle - vCycle, 0);
        const endIndex = Math.min(startIndex + vCycle, meanFreq.length);
        console.log("startIndex:", startIndex, "endIndex:", endIndex);

        setVStartFreq(startIndex);
        setVEndFreq(endIndex);

        setVMeanFreq(_.slice(meanFreq, startIndex, endIndex));
        setVPeakFreq(_.slice(peakFreq, startIndex, endIndex));

        const selectedValues = _.slice(_.range(peakFreq.length), startIndex, endIndex);
        console.log("cycle:", cycle, "pauseCycel:", pauseCycle, "startIndex:", startIndex, "endIndex:", endIndex);
        console.log("selectedValues:", selectedValues);
      }
    }

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

    // TODO: 해당 cycle 에 맞는 threshold 가 불러와지는지 확인 필요
    if (activity && threshold.length > 0) {
      // console.log("cycle:", cycle, "activity:", activity, "threshold:", threshold);
      // const WARN_MSG = ["Warning", "Caution", "Danger"];
      const WARN_MSG = ["Low", "Moderate", "High"];
      // let position = getRandomInt(1, 5);
      const result = getThresholdPosition(textToNumArray(activity, ","));
      const position = result.position;

      let warn = result.power - 1;
      let time = getDateTime(cycle * ms);
      const duplicateCycle = recent.some((el: any) => el.cycle === cycle); // check if duplicate cycle exists
      if (!duplicateCycle) {
        // proceed only if there is no duplicate cycle
        recent.push({ cycle: cycle, time: time, position: position, activity: activity, warn: WARN_MSG[warn] });
        setRecent(recent);
        setLeak({ leak: position, sensor: 1, distance: position, time: time });
      }
    } else {
      setLeak({ leak: 0, sensor: 0, distance: 0, time: "" });
    }
  };

  const getThresholdPosition = (activity: any) => {
    // const thresholds = [[45.1, 15.0, 30.1], [29.8, 0.1, 20.8], [15.3, 30.6], [31.3, 33.6], [15.8]];
    const thresholds = [
      [45.1, 15.0, 30.1],
      [29.8, 0.1, 20.8],
      [15.3, 30.6],
      [15.6, 31.1],
      [15.8, 25.4],
    ];
    // const positions = [1, 2, 3, 4, 5];
    const positions = [5, 4, 3, 2, 1];
    let power = 0;

    // 입력된 activity 배열과 thresholds 배열을 비교하여 교집합을 찾습니다.
    for (let i = 0; i < thresholds.length; i++) {
      const threshold = thresholds[i];
      const intersection = activity.filter((value: any) => threshold.includes(value));
      if (intersection.length > 0) {
        power = intersection.length;
        return { position: positions[i], power };
      }
    }

    // 교집합이 없는 경우 가장 마지막 position 값을 반환합니다.
    // return { position: positions[positions.length - 1], power: 0 };
    // 교집합이 없는 경우 position 4와 power 0을 반환합니다.
    return { position: 0, power: 1 };
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

  const onClickReset = () => {
    reset(-1);
  };

  const reset = (cycle: number) => {
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
    setAmpIndex([]);
    setAmpData([]);
    setLeak({ leak: 0, sensor: 0, distance: 0, time: "" });
    setThreshold([]);
    setTvIndexTop([]);
    setRecent([]);

    setMeanFreq([]);
    setPeakFreq([]);
    setVMeanFreq([]);
    setVPeakFreq([]);
    setVStartFreq(0);
    setVEndFreq(0);
  };

  const onClickPause = () => {
    if (!isPause) {
      setPauseCycle(cycle);
    } else {
      console.log("pauseCycle: " + pauseCycle);
      setCycle(pauseCycle);
      setCycleChartArr(pauseCycle);
      if (pauseCycle === 0 || pauseCycle === cycles - 1) {
        setMeanFreq([]);
        setPeakFreq([]);
        // setVStartFreq(0);
        // setVEndFreq(0);
        setCycle(0);
      }
    }

    setVStartFreq(0);
    setVEndFreq(0);
    // console.log("pauseCycle: " + pauseCycle);
    setIsPause(!isPause);
    // setCycle(cycle);
  };

  // TODO: Prev, Next 버튼 클릭시 기준이 되는 값과 방향의 모호성으로 인해 prev값이 제대로 설정되지 않고 있으니 참고하여 수정 필요
  const onClickPrev = () => {
    console.log("Prev: " + cycle);
    if (cycle > 0) {
      setCycle((prev) => (prev - 1) % cycles);
      setCycleChartArr((cycle - 1) % cycles);
      setLeakStatus(cycle - 1);
      setIsPause(true);
      setIsRecent(true);
      console.log("pauseCycle: " + pauseCycle);
    }
  };

  const onClickNext = () => {
    console.log("Next: " + cycle);
    if (cycle < cycles - 1) {
      setCycle((prev) => (prev % cycles) + 1);
      setCycleChartArr((cycle + 1) % cycles);
      setLeakStatus((cycle + 1) % cycles);
      setIsPause(true);
      setIsRecent(true);
      console.log("pauseCycle: " + pauseCycle);
    }
  };

  const onChangeCycle = (cycle: number) => {
    if (isPause) {
      setCycle(cycle);
      setCycleChartArr(cycle);
      setLeakStatus(cycle);
      setIsPause(true);
      setIsRecent(true);
    }
  };

  const onClickRecent = (cycle: number) => {
    console.log("Recent: " + cycle);
    setIsPause(true);
    setCycle(cycle);
    setCycleChartArr(cycle);
    setLeakStatus(cycle);
    setIsRecent(true);
    // TODO: 해당 cycle 에 맞는 threshold 가 불러와지는지 확인 필요
    // setThresholdTable;
  };

  const setLeakStatus = (cycle: number) => {
    const selectedLeak = recent.find((el: any) => el.cycle === cycle);

    if (selectedLeak) {
      setLeak({ leak: selectedLeak.position, sensor: 1, distance: selectedLeak.position, time: selectedLeak.time });
    } else {
      setLeak({ leak: 0, sensor: 0, distance: 0, time: "" });
    }
  };

  const handleResults = (results: any) => {
    setWaveIndex([]);
    setWaveData([]);
    setAverageData([]);
    const csvData = chunk(_.dropRight(results));
    let indexData = csvData.indexData;
    let chunkedData = csvData.offsetData;
    let averageData = csvData.averageData;

    setWaveIndex(indexData);

    setAverageData(averageData);
    setWaveData(chunkedData);
    setCycles(chunkedData.length);
    //console.log(averageData);
    //console.log(chunkedData);
    //console.log(chunkedData.length);

    setCycle(0);
    setIsPause(false);
  };

  const handleRecentCntChange = (value: string) => {
    const recentCnt = parseInt(value);
    setRecentCnt(recentCnt);
  };

  return (
    <>
      <S.PageWrapper>
        <S.LeftWrapper>
          <S.CsvWrapper>
            <CsvReader handleResults={handleResults} />
          </S.CsvWrapper>

          <S.ChartWrapper>
            <AmpFft index={ampIndex} count={cycle} plots={ampData} tv={_.mean(ampData)} minY={minY} maxY={maxY} />
          </S.ChartWrapper>

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

          <S.ControlWrapper>
            <S.CycleWrapper>time:</S.CycleWrapper>
            {cycle > -1 && !isPause && <S.ControlButton onClick={onClickPause}>Pause</S.ControlButton>}
            {cycle > -1 && isPause && (
              <>
                <S.ControlButton onClick={onClickPause}>Resume</S.ControlButton>
                <S.ControlButton onClick={onClickPrev}>Prev</S.ControlButton>
                <S.ControlButton onClick={onClickNext}>Next</S.ControlButton>
                <S.ControlButton onClick={onClickReset}>Reset</S.ControlButton>
              </>
            )}
          </S.ControlWrapper>

          <S.ChartWrapper>
            <AmpFft index={ampIndex} count={cycle} plots={ampData} tv={_.mean(ampData)} minY={minY} maxY={maxY} />
          </S.ChartWrapper>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.ResultWrapper>
            <S.ResultRow>
              <S.ResultBox>
                <S.Box>
                  <S.Result>Mean value</S.Result>
                </S.Box>
              </S.ResultBox>
              <S.ResultBox>
                <S.Box>
                  <S.Result>Standard deviation</S.Result>
                </S.Box>
              </S.ResultBox>
              <S.ResultBox>
                <S.Box>
                  <S.Result>RMS value</S.Result>
                </S.Box>
              </S.ResultBox>
              <S.ResultBox>
                <S.Box>
                  <S.Result>Peak value</S.Result>
                </S.Box>
              </S.ResultBox>
            </S.ResultRow>
            <S.ResultRow>
              <S.ResultBox>
                <S.Box>
                  <S.Result>Frequency centroid</S.Result>
                </S.Box>
              </S.ResultBox>
              <S.ResultBox>
                <S.Box>
                  <S.Result>Peak frequency</S.Result>
                </S.Box>
              </S.ResultBox>
              <S.ResultBox>
                <S.Box>
                  <S.Result>Average frequency</S.Result>
                </S.Box>
              </S.ResultBox>
              <S.ResultBox>
                <S.Box>
                  <S.Result>Energy</S.Result>
                </S.Box>
              </S.ResultBox>
            </S.ResultRow>
          </S.ResultWrapper>

          <S.RecentActivity>
            <S.SectionTitleWrapper>
              <S.SectionTitle>Recent Activity</S.SectionTitle>
              <S.RecentControlWrapper>
                <DatePicker defaultValue={dayjs(getDateTime(0), "YYYY-MM-DD")} size={"small"} allowClear={false} />
                <Space wrap>
                  <S.StyledSelect
                    defaultValue="10"
                    size="small"
                    style={{ width: 120 }}
                    onChange={handleRecentCntChange}
                    options={[
                      { value: "10", label: "최근 10건" },
                      { value: "100", label: "최근 100건" },
                      { value: "500", label: "최근 500건" },
                      { value: "-1", label: "전체" },
                      // { value: "1000", label: "최근 1000건", disabled: true },
                    ]}
                  />
                </Space>
              </S.RecentControlWrapper>
            </S.SectionTitleWrapper>

            <S.SectionRecentWrapper>
              {recent
                .slice()
                .reverse()
                .slice(0, recentCnt < 0 ? undefined : recentCnt)
                .map((el: any) => (
                  <S.RecentWrapper key={el.cycle} id={el.cycle} onClick={() => onClickRecent(el.position)}>
                    <S.RecentItemWrapper style={{ width: "33%" }}>
                      <S.LeakPositionWrapper>
                        <S.LeakPosition>센서#1</S.LeakPosition>
                      </S.LeakPositionWrapper>
                    </S.RecentItemWrapper>
                    <S.RecentItemWrapper style={{ width: "33%" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <S.RecentType>[{el.time}]</S.RecentType>
                        <S.RecentType style={{ marginTop: "10px" }}>[{el.time}]</S.RecentType>
                      </div>
                    </S.RecentItemWrapper>
                    <S.RecentWarnWrapper style={{ width: "33%" }}>
                      <S.RecentWarn>
                        <InfoCircleOutlined />
                        {el.warn}
                      </S.RecentWarn>
                    </S.RecentWarnWrapper>
                  </S.RecentWrapper>
                ))}
            </S.SectionRecentWrapper>
            {/* <S.RecentButtonWrapper>
            <Button type="primary" onClick={onClickViewAllHistory} style={{ width: "100%", height: "60px", margin: "10px 0", padding: "10px" }}>
              <S.ButtonText>
                {!isViewAllHistory && "View All Recent Activities"}
                {isViewAllHistory && "View Recent 10 Activities"}
              </S.ButtonText>
            </Button>
          </S.RecentButtonWrapper> */}
          </S.RecentActivity>
        </S.RightWrapper>
      </S.PageWrapper>
    </>
  );
}
