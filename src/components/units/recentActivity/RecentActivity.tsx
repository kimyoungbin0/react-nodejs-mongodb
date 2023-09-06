import React, { useState, useEffect, useRef } from "react";
import * as S from "./RecentActivity.style";

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

export default function RecentActivity(props) {
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

  const [chartKind, setChartKind] = useState("fft");

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

    const averageArr = setAvgData(offsetArr, 40);

    return { indexData, offsetData: offsetArr, averageData: averageArr };
  };

  useInterval(() => {
    if ((!isPause && cycle > -1) || isRecent) {
      if (cycle === 0) {
        setDateTime();
        setStartDate(getDateTime(0));
        setRecent([]);
        // fetchDB();
        // deleteDB();
      }
      setCycleChartArr(cycle);

      // const temp = getTdAmp(waveData[cycle % cycles]);
      // setAmpIndex(temp.frequencies);
      // setAmpData(temp.fdAmp);
      if (!isRecent) {
        if (cycle + 1 < cycles) {
          setCycle((prev) => (prev + 1) % cycles);
        } else {
          setIsPause(true);
          setPauseCycle(cycles - 1);
        }
      }
      // checkLeak((cycle + 1) % cycles);

      // average data reset 주석처리
      // if (recent.length === 1) {
      //   const result = setAvgData(waveData, cycle - 2);
      //   setAverageData(result);
      // }

      setIsRecent(false);
    }
  }, ms);

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

  const onClickRecent = (buttonText) => {
    if ("All/" + buttonText === props.value) {
      window.location.href = "/fftos2";
    } else {
      props.setValue("All/" + buttonText);
    }
  };

  const setLeakStatus = (cycle: number) => {
    // console.log(cycle);
    const selectedLeak = recent.find((el: any) => el.cycle === cycle);

    if (selectedLeak) {
      // do something with the found element, e.g. console.log(foundElement)
      setLeak({ leak: selectedLeak.position, sensor: 1, distance: selectedLeak.position, time: selectedLeak.time });
    } else {
      // handle the case when no element with cycle === n was found
      setLeak({ leak: 0, sensor: 0, distance: 0, time: "" });
    }
  };

  // const onClickViewAllHistory = (event: any) => {
  //   setIsViewAllHistory(!isViewAllHistory);
  // };

  const handleRecentCntChange = (value: string) => {
    const recentCnt = parseInt(value);
    // if (recentCnt > 0) {
    setRecentCnt(recentCnt);
    // } else {
    //   setIsViewAllHistory(true);
    // }
  };

  //  recent acitivity 예시
  useEffect(() => {
    const data = [
      { cycle: "cycle1", time: "07-26 12:34:56", position: "후판", activity: 3000, warn: "warning" },
      { cycle: "cycle2", time: "07-26 12:34:56", position: "제강", activity: 3000, warn: "warning" },
      { cycle: "cycle3", time: "07-26 12:34:56", position: "원료1", activity: 3000, warn: "warning" },
      { cycle: "cycle4", time: "07-26 12:34:56", position: "연주", activity: 3000, warn: "warning" },
      { cycle: "cycle5", time: "07-26 12:34:56", position: "원료3", activity: 3000, warn: "warning" },
      { cycle: "cycle6", time: "07-26 12:34:56", position: "원료4", activity: 3000, warn: "warning" },
      { cycle: "cycle7", time: "07-26 12:34:56", position: "원료5", activity: 3000, warn: "warning" },
      // Add more items here as needed
    ];

    const filteredData = props.value === "All/Rina" ? data : data.filter((el) => "All/" + el.position === props.value);
    setRecent(filteredData);
  }, [props.value]);

  return (
    <>
      <S.RightWrapper>
        <S.SectionTitleWrapper>
          <S.SectionTitle>Recent Activity</S.SectionTitle>
          <S.RecentControlWrapper>
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
                    <S.LeakPosition>{el.position}</S.LeakPosition>
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
      </S.RightWrapper>
    </>
  );
}