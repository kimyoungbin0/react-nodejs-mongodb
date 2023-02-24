import React, { useState, useEffect, useRef } from "react";
import _, { max } from "lodash";
import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";
import WaveLive from "../chart/waveLive";
import AmpLive from "../chart/ampLive";

import styled from "@emotion/styled";
import { addCommas, getRandomInt } from "../../commons/libraries/utils";
import { getDateTime, setDateTime } from "../../commons/libraries/date";

const Wrapper = styled.div`
  width: 100%;
  max-width: 850px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  /* max-height: 370px; */
  border: 1px solid #cccccc;
`;

const ChartControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  max-width: 600px;
  min-height: 30px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  /* border: 1px solid #cccccc; */
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 250px;
  max-width: 100%;
  max-height: 370px;
  padding: 5px;
  overflow: auto;
  border: 1px solid #cccccc;
`;

const InnerTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 240px;
  max-height: 50%;
  /* min-height: 50%; */
  overflow: auto;
  border: 1px solid #cccccc;
`;

const CycleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  min-height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  /* border: 1px solid #cccccc; */
`;

const ControlWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  min-height: 30px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  /* border: 1px solid #cccccc; */
`;

const ControlButton = styled.button`
  margin: 0 5px;
`;

const WrapperCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const PipeWrapper = styled.div`
  width: 100%;
  max-width: 850px;
  padding: 20px;
  border: 1px solid #cccccc;
  /* background-color: #bc960d; */
  background-image: url("/images/pipe_bg.jpg");
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PipeBlock = styled.div`
  min-width: 10%;
  padding: 10px;
  background-color: #d3d3d386;
  border: 1px solid darkgray;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PipeBlockLeak = styled.div`
  min-width: 10%;
  padding: 10px;
  color: white;
  background-color: red;
  border: 1px solid darkgray;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SensorBlock = styled.div`
  min-width: 10%;
  padding: 10px;
  background-image: url("/images/sensor.png");
  background-size: auto;
  background-repeat: no-repeat;
  /* background-color: #ffff0067; */
  border: 1px solid #cccccc;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SensorBlockLeak = styled.div`
  min-width: 10%;
  padding: 10px;
  color: white;
  background-color: red;
  border: 1px solid #cccccc;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ThresholdBlock = styled.div`
  min-width: 10%;
  padding: 10px;
  background-color: white;
  border: 1px solid #cccccc;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
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

export default function DaqCsvReader() {
  const [cycle, setCycle] = useState(-1);
  const [cycles, setCycles] = useState(0);
  const [isPause, setIsPause] = useState(true);
  const [plotCount, setPlotCount] = useState(0);
  const [waveData, setWaveData] = useState([] as any);
  const [offsetData, setOffsetData] = useState([] as any);
  const [waveIndex, setWaveIndex] = useState([] as any);
  const [isAmpChart, setIsAmpChart] = useState(false);
  const [ampIndex, setAmpIndex] = useState([]);
  const [ampData, setAmpData] = useState([] as any);
  const [tvIndex, setTvIndex] = useState([] as any);
  const [tv, setTv] = useState(24);
  const [tvSeq, setTvSeq] = useState(5);
  const [startTv, setStartTv] = useState(0);
  const [endTv, setEndTv] = useState(0);
  const [maxAmp, setMaxAmp] = useState({ freq: 0, amp: 0 });
  const [threshold, setThreshold] = useState([] as any);
  const [isThreshold, setIsThreshold] = useState(false);

  const [startDate, setStartDate] = useState("");
  // const [leak, setLeak] = useState(0);
  const [leak, setLeak] = useState({ leak: 0, sensor: 0, distance: 0 });

  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  );

  // useEffect(() => {
  //   setChartData(chunkData);
  // }, [chunkData]);

  // const fixedLabels = _.times(plotCount, (index) => index);
  // const freqLabels = _.times(4096, (index) => index * 20);

  function convertToArrayOfArrays(arr: any[]) {
    // console.log("=================================================");
    // console.log(arr);
    // console.log("=================================================");
    return arr.map((x) => {
      let subArray = [];
      for (let i = x - 2; i <= x; i++) {
        subArray.push(i);
      }
      return subArray;
    });
  }

  const extractSubarray = (dataArr: number[], seq: number) => {
    let subArrays = [];
    let subArray = [];
    for (let i = 0; i < dataArr.length; i++) {
      subArray.push(dataArr[i]);
      if (i + 1 < dataArr.length && dataArr[i + 1] - dataArr[i] !== 1) {
        if (subArray.length >= seq) {
          subArrays.push(subArray);
        }
        subArray = [];
      }
    }
    if (subArray.length >= seq) {
      subArrays.push(subArray);
    }
    return subArrays;
  };

  const checkThresholdIndex = (arr: any[], seq: number) => {
    const tvEndPointArr = _.map(arr, "cycle");
    const result = extractSubarray(tvEndPointArr, seq);

    setTvIndex(result);

    return _.flatten(result);
  };

  const createThreshold = (chunkData: any[]) => {
    let maxPlotInCycle = [];
    for (let i = 0; i < chunkData.length; i++) {
      const maxPlot = Number(_.max(chunkData[i]));
      const leak = getRandomInt(1, 10);
      // const sensor = getRandomInt(1, 2);
      let sensor = 0;
      if (leak <= 3) {
        sensor = 1;
      } else if (leak >= 8) {
        sensor = 2;
      } else if (leak > 3 && leak < 6) {
        sensor = 3;
      } else {
        sensor = 4;
      }

      let distance = 0;
      if (sensor === 1) {
        distance = leak;
      } else if (sensor === 2) {
        distance = 10 - leak + 1;
      } else {
        distance = leak <= 10 - leak + 1 ? leak : 10 - leak + 1;
      }

      if (maxPlot > tv) {
        maxPlotInCycle.push({
          cycle: i,
          maxPlot: maxPlot,
          warn: 0,
          position: 0,
          leak: leak,
          sensor: sensor,
          distance: distance,
        });
      }
    }

    const result = checkThresholdIndex(maxPlotInCycle, tvSeq);
    // console.log(result);

    let count = 1;
    let prevCycle = 0;
    maxPlotInCycle.forEach((obj, index) => {
      if (result.includes(obj.cycle)) {
        if (obj.cycle - prevCycle > 1) {
          count = 1;
        } else {
        }
        obj.warn = count;
        count++;
      } else {
        count = 1;
      }
      prevCycle = obj.cycle;
    });

    // console.log(maxPlotInCycle);

    for (let i = 1; i < maxPlotInCycle.length; i++) {
      if (maxPlotInCycle[i - 1].warn < maxPlotInCycle[i].warn) {
        maxPlotInCycle[i - 1].position = 0;
        maxPlotInCycle[i].position = 1;
      } else {
        maxPlotInCycle[i].position = 0;
      }
    }

    // console.log(maxPlotInCycle);
    return maxPlotInCycle;
  };

  const chunk = (data: any[]) => {
    const unzipIndex = _.unzip(data)[4];
    const maxIndex: number = Number(_.max(unzipIndex));
    const plotCount = maxIndex + 1;
    setPlotCount(plotCount);
    const indexData = _.chunk(unzipIndex, plotCount).filter(
      (subArray) => subArray.length === plotCount
    );

    const unzipData = _.unzip(data)[5];
    const flatData = _.map(unzipData, (el: number) => el / flatValue);
    const chunkData = _.chunk(flatData, plotCount).filter(
      (subArray) => subArray.length === plotCount
    );

    const offsetAvg = _.map(chunkData, (el) => _.mean(el));

    let offsetArr = new Array();
    for (let i = 0; i < offsetAvg.length; i++) {
      const offset = _.map(chunkData[i], (el: number) => el - offsetAvg[i]);
      offsetArr.push(offset);
    }

    setOffsetData(offsetArr);
    setThreshold(createThreshold(offsetArr));

    return { indexData, offsetData: offsetArr };
  };

  const getTdAmp = (data: any) => {
    tdAmpData = _.drop(tdAmpData, plotCount);
    tdAmpData = _.concat(tdAmpData, data);

    const fft = require("fft-js").fft;
    const fftUtil = require("fft-js").util;
    const signal = _.takeRight(tdAmpData, 4096 * 2);

    const phasors = fft(signal);

    const frequencies = fftUtil.fftFreq(phasors, 7200); // Sample rate and coef is just used for length, and frequency step
    const magnitudes = fftUtil.fftMag(phasors);

    const _fdAmp = _.map(magnitudes, (el) => (Math.abs(el) * 2) / 7200);
    const _amp = _.max(_fdAmp);

    const _ampIndex = _.indexOf(_fdAmp, _amp);

    const _freq = frequencies[_ampIndex];
    setMaxAmp({ freq: _freq, amp: Number(_amp) });

    return { frequencies: frequencies, fdAmp: _fdAmp };
  };

  useInterval(() => {
    if (!isPause && cycle > -1) {
      if (cycle === 0) {
        setDateTime();
        setStartDate(getDateTime(0));
      }

      const temp = getTdAmp(waveData[cycle % cycles]);
      setAmpIndex(temp.frequencies);
      setAmpData(temp.fdAmp);
      setCycle((prev) => (prev + 1) % cycles);

      checkLeak((cycle + 1) % cycles);
    }
  }, 1000);

  const checkLeak = (cycle: number) => {
    // const leakValue = threshold.find((el: any) => el.cycle === cycle)?.leak;
    // if (leakValue > 0) setLeak(leakValue);
    // else setLeak(0);
    const leakValue = threshold.find((el: any) => {
      if (el.cycle === cycle) {
        return { leak: el.leak, sensor: el.sensor, distance: el.distance };
      }
      return null;
    });
    if (leakValue?.leak > 0) setLeak(leakValue);
    else setLeak({ leak: 0, sensor: 0, distance: 0 });
  };

  const onChangeTv = (event: any) => {
    setTv(event.target.value);
  };

  const onChangeSeq = (event: any) => {
    setTvSeq(event.target.value);
  };

  const onClickApply = () => {
    setThreshold(createThreshold(offsetData));
  };

  const onClickIsAmpChart = () => {
    setIsAmpChart(!isAmpChart);
    // setCycle(cycle);
  };

  const onClickPause = () => {
    setIsPause(!isPause);
    setCycle(Number(cycle));
    checkLeak(cycle);
  };

  const onClickReset = () => {
    setCycle(-1);
    setPlotCount(0);
    setCycles(0);
    setAmpData([]);
    setTvIndex([]);
    setThreshold([]);
    tdAmpData = _.fill(Array(4096 * 2), 0);
    setIsPause(true);
    setIsThreshold(false);
  };

  const onClickPrev = () => {
    console.log("Prev: " + cycle);
    if (cycle > 0) {
      setCycle((prev) => (prev - 1) % cycles);
      checkLeak((cycle - 1) % cycles);
    }
    setIsPause(true);
  };

  const onClickNext = () => {
    console.log("Next: " + cycle);
    if (cycle < cycles - 1) {
      setCycle((prev) => (prev % cycles) + 1);
      checkLeak((cycle + 1) % cycles);
    }
    setIsPause(true);
  };

  const onClickTv = (event: any) => {
    const [startTv, endTv] = event.currentTarget.id.split(":");
    setIsPause(true);
    setIsThreshold(true);
    setCycle(Number(startTv));
    setStartTv(Number(startTv));
    setEndTv(Number(endTv));
    checkLeak(cycle);
  };

  const onClickWarn = (event: any) => {
    setIsPause(true);
    setCycle(event.currentTarget.id);
    checkLeak(cycle);
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
            const csvData = chunk(_.drop(results.data));
            // setICount(_.max(csvData.indexData[0]));
            let indexData = csvData.indexData;
            let chunkedData = csvData.offsetData;
            // console.log(indexData);
            // console.log(chunkedData);

            setWaveIndex(indexData);
            setWaveData(chunkedData);
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
          startAt: {startDate} / cycle: {cycle} / cycles: {cycles} / plots:{" "}
          {addCommas(plotCount)}
        </CycleWrapper>
        <ControlWrapper>
          threshold:{" "}
          <input
            id="tv"
            type="number"
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={tv}
            onChange={onChangeTv}
          />{" "}
          seq:{" "}
          <input
            id="tvSeq"
            type="number"
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={tvSeq}
            onChange={onChangeSeq}
          />
          <ControlButton onClick={onClickApply}>Apply</ControlButton>
        </ControlWrapper>
      </Wrapper>
      <Wrapper>
        <ChartWrapper>
          <WaveLive
            index={waveIndex[cycle]}
            count={cycle}
            plots={waveData[cycle]}
          />

          {cycle > -1 && (
            <ChartControlWrapper>
              <input
                type="range"
                min="0"
                max={cycles - 1}
                value={cycle}
                onChange={(e) => setCycle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </ChartControlWrapper>
          )}
          <ChartControlWrapper>
            {cycle > -1 && !isPause && (
              <ControlButton onClick={onClickPause}>Pause</ControlButton>
            )}
            {cycle > -1 && isPause && (
              <ControlButton onClick={onClickPause}>Resume</ControlButton>
            )}
            {cycle > -1 && (
              <ControlButton onClick={onClickReset}>Reset</ControlButton>
            )}
            {cycle > -1 && !isAmpChart && (
              <ControlButton onClick={onClickIsAmpChart}>
                Show AmpChart
              </ControlButton>
            )}
            {cycle > -1 && isAmpChart && (
              <ControlButton onClick={onClickIsAmpChart}>
                Hide AmpChart
              </ControlButton>
            )}
            {cycle > -1 && isPause && (
              <ControlButton onClick={onClickPrev}>Prev</ControlButton>
            )}
            {cycle > -1 && isPause && (
              <ControlButton onClick={onClickNext}>Next</ControlButton>
            )}
          </ChartControlWrapper>
        </ChartWrapper>
        <TableWrapper>
          <InnerTableWrapper>
            {tvIndex.length > 0 &&
              tvIndex.map((el: any, index: number) => {
                let bgColor = "#ffffff";
                if (index % 2 === 0) {
                  bgColor = "#ffffff";
                } else {
                  bgColor = "#cccccc";
                }

                return (
                  <>
                    <div style={{ background: bgColor }}>
                      <div>
                        {getDateTime(el[0] * 1000)} ~{" "}
                        {getDateTime(el[el.length - 1] * 1000, "time")}
                      </div>

                      <div
                        style={{
                          // paddingLeft: "10px",
                          borderBottom: "1px solid #cccccc",
                        }}
                        key={index}
                        id={`${el[0]}:${el[el.length - 1]}`}
                        onClick={onClickTv}
                      >{`> l: ${index} s: ${el[0]} e: ${
                        el[el.length - 1]
                      } seq: ${el.length}`}</div>
                    </div>
                  </>
                );
              })}
          </InnerTableWrapper>
          <InnerTableWrapper>
            {isThreshold &&
              threshold.map((el: any, index: number) => (
                <div key={el.cycle} id={el.cycle} onClick={onClickWarn}>
                  {el.warn > 0 &&
                    el.cycle >= startTv &&
                    el.cycle <= endTv &&
                    `${el.warn} (${el.cycle})[${el.leak}]: ${el.maxPlot}`}
                </div>
              ))}
          </InnerTableWrapper>
        </TableWrapper>
      </Wrapper>

      {isAmpChart && (
        <>
          <Wrapper>
            <CycleWrapper>
              maxAmp: {maxAmp.freq} / {maxAmp.amp}
            </CycleWrapper>
          </Wrapper>
          <Wrapper>
            <ChartWrapper>
              <AmpLive index={ampIndex} count={cycle} plots={ampData} />
            </ChartWrapper>
            <TableWrapper></TableWrapper>
          </Wrapper>
        </>
      )}

      <WrapperCol>
        <PipeWrapper>
          {(() => {
            let a = 3;
            const blocks = [];
            for (let i = 1; i <= 10; i++) {
              if (leak.leak === i) {
                blocks.push(<PipeBlockLeak key={i}>{i}</PipeBlockLeak>);
              } else {
                blocks.push(<PipeBlock key={i}>{i}</PipeBlock>);
              }
            }
            return blocks;
          })()}
        </PipeWrapper>

        <PipeWrapper style={{ justifyContent: "space-between" }}>
          {(leak.sensor === 0 || leak.sensor === 2) && (
            <SensorBlock>FlexMate Sensor 1</SensorBlock>
          )}
          {(leak.sensor === 1 || leak.sensor >= 3) && (
            <SensorBlockLeak>FlexMate Sensor 1</SensorBlockLeak>
          )}

          {leak.leak > 0 && (
            <ThresholdBlock>
              Pipe 1 Threshold Detection at {getDateTime(cycle * 1000)} |
              Sensor:
              {leak.sensor < 3 ? leak.sensor : leak.sensor - 2} / Distance:{" "}
              {leak.distance}m
            </ThresholdBlock>
          )}

          {(leak.sensor === 0 || leak.sensor === 1) && (
            <SensorBlock>FlexMate Sensor 2</SensorBlock>
          )}
          {(leak.sensor === 2 || leak.sensor >= 3) && (
            <SensorBlockLeak>FlexMate Sensor 2</SensorBlockLeak>
          )}
        </PipeWrapper>
      </WrapperCol>
    </>
  );
}
