import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";
import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";

import styled from "@emotion/styled";
import { addCommas, getRandomInt } from "../../commons/libraries/utils";
import { getDateTime, setDateTime } from "../../commons/libraries/date";
import AmpFft from "../chart/ampFft";
import {
  averageByColumn,
  getThresholdData,
  reduceArray,
  reduceMaxArray,
  roundArray,
  subtractArrays,
} from "../../commons/libraries/array";
// import { useTable } from "react-table";

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
  min-width: 400px;
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

const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
  DEFAULT_REMOVE_HOVER_COLOR,
  40
);
const GREY_DIM = "#686868";

const flatValue = 26;
let tdAmpData = _.fill(Array(4096 * 2), 0);

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

const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    // height: "100%",
    width: "100%",
    maxWidth: "850px",
    height: "100px",
    justifyContent: "center",
    // margin: 10,
  },
  file: {
    background: "linear-gradient(to bottom, #EEE, #DDD)",
    borderRadius: 20,
    display: "flex",
    height: 120,
    width: 120,
    position: "relative",
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "center",
  },
  info: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
  },
  size: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    marginBottom: "0.5em",
    justifyContent: "center",
    display: "flex",
  },
  name: {
    backgroundColor: GREY_LIGHT,
    borderRadius: 3,
    fontSize: 12,
    marginBottom: "0.5em",
  },
  progressBar: {
    bottom: 14,
    position: "absolute",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  zoneHover: {
    // borderColor: GREY_DIM,
  },
  default: {
    // borderColor: GREY,
  },
  remove: {
    height: 23,
    position: "absolute",
    right: 6,
    top: 6,
    width: 23,
  },
};

let indexCount: { [index: number]: number } = {};

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
  const [tv, setTv] = useState(13);
  const [tvIndexTop10, setTvIndexTop10] = useState([] as any);

  const [threshold, setThreshold] = useState([] as any);
  const [minY, setMinY] = useState(-100);
  const [maxY, setMaxY] = useState(100);

  const [startDate, setStartDate] = useState("");
  // const [leak, setLeak] = useState(0);
  const [leak, setLeak] = useState({ leak: 0, sensor: 0, distance: 0 });

  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

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

      // const temp = getTdAmp(waveData[cycle % cycles]);
      // setAmpIndex(temp.frequencies);
      // setAmpData(temp.fdAmp);
      setCycle((prev) => (prev + 1) % cycles);

      // checkLeak((cycle + 1) % cycles);
    }
  }, 1000);

  useEffect(() => {
    setCycleChartArr(cycle);
  }, [cycle]);

  const setCycleChartArr = (cycle: number) => {
    if (cycle < 0) return;

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

    setThreshold(thresholdData);

    if (!isPause) {
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

      const sorted = Object.entries(indexCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
      setTvIndexTop10(sorted);
      // console.log(sorted);
    }

    setAmpIndex(filteredIndexArr);
    setAmpData(filteredDataArr);
    setPlotCount(plotCount);

    const min = Math.floor(Math.min(...filteredDataArr) / 10) * 10;
    const max = (Math.floor(Math.max(...filteredDataArr) / 10) + 1) * 10;
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
    const tv = parseInt(tvInputElement?.value || "0");
    const minFreq = parseInt(minFreqInputElement?.value || "0");
    const maxFreq = parseInt(maxFreqInputElement?.value || "0");
    const scale = Math.floor(parseFloat(scaleInputElement?.value || "0"));
    setTv(tv);
    setMinFreq(minFreq);
    setMaxFreq(maxFreq);
    setScale(scale);
    console.log("Apply: " + cycle);
    if (cycle > -1) setCycleChartArr((cycle - 1) % cycles);
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
      {isPause && cycle === -1 && (
        <CSVReader
          config={{
            header: false,
            newline: "\n",
            fastMode: true,
            dynamicTyping: true,
            delimitersToGuess: [", ", ",", "	", "|", ";"],
            // prettier-ignore
            columns: ["TimeStamp(ms)", "index", "UPS", "TimeStamp(ms)", "index", "DNS"],
          }}
          onUploadAccepted={(results: any) => {
            console.time("==== onUploadAccepted ====");
            setCycle(0);
            setIsPause(false);
            setWaveIndex([]);
            setWaveData([]);
            setAverageData([]);
            const csvData = chunk(_.dropRight(results.data));
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
            // setWaveData(adjustedData);
            setCycles(chunkedData.length);
            setZoneHover(false);
            console.timeEnd("==== onUploadAccepted ====");
          }}
          onDragOver={(event: any) => {
            event.preventDefault();
            setZoneHover(true);
          }}
          onDragLeave={(event: any) => {
            event.preventDefault();
            setZoneHover(false);
          }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
            Remove,
          }: any) => (
            <>
              <div
                {...getRootProps()}
                style={Object.assign(
                  {},
                  styles.zone,
                  zoneHover && styles.zoneHover
                )}
              >
                {acceptedFile ? (
                  <>
                    {/* <div style={styles.file}>
                      <div style={styles.info}> */}
                    <div>
                      <div>
                        <span style={styles.size}>
                          {formatFileSize(acceptedFile.size)}
                        </span>
                        <span style={styles.name}>{acceptedFile.name}</span>
                      </div>
                      {/* <div style={styles.progressBar}> */}
                      <div>
                        <ProgressBar />
                      </div>
                      <div
                        {...getRemoveFileProps()}
                        style={styles.remove}
                        onMouseOver={(event) => {
                          event.preventDefault();
                          setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                        }}
                        onMouseOut={(event) => {
                          event.preventDefault();
                          setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                        }}
                      >
                        <Remove color={removeHoverColor} />
                      </div>
                    </div>
                  </>
                ) : (
                  "Drop CSV file here or click to upload"
                )}
              </div>
            </>
          )}
        </CSVReader>
      )}
      <Wrapper>
        <CycleWrapper>
          cycle: {cycle} / cycles: {cycles} / plots: {addCommas(plotCount)}
        </CycleWrapper>
        <ControlWrapper>
          tv:{" "}
          <input
            id="tv"
            type="number"
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={tv}
            // onChange={onChangeTv}
          />{" "}
          min:{" "}
          <input
            id="minFreq"
            type="number"
            min={0}
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={minFreq}
            // onChange={onChangeMaxFreq}
          />{" "}
          max:{" "}
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
          {/* <AmpFft index={waveIndex} count={cycle} plots={waveData[cycle]} /> */}
          <AmpFft
            index={ampIndex}
            count={cycle}
            plots={ampData}
            tv={tv}
            minY={minY}
            maxY={maxY}
          />
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
      <Wrapper>
        <TableWrapper>
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
              {threshold.map((data: any) => (
                <tr key={`${data.sector}-${data.maxValue}`}>
                  <td>{data.sector}</td>
                  <td>{data.maxIndex}</td>
                  <td>{data.maxValue}</td>
                  <td>{data.maxAverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
        <TableWrapper>
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {tvIndexTop10.map((data: any) => (
                <tr key={`${data[0]}-${data[1]}`}>
                  <td>{data[0]}</td>
                  <td>{data[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </Wrapper>
    </>
  );
}
