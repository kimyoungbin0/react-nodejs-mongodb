import React, { useState, useEffect, CSSProperties, useRef } from "react";
import _, { max } from "lodash";
import {
  useCSVReader,
  lightenDarkenColor,
  formatFileSize,
} from "react-papaparse";
import WaveChart from "./waveChart";
import AmpChart from "./ampChart";

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
    height: "100px",
    justifyContent: "center",
    padding: 20,
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

export default function CSVReader() {
  // const [chartData, setChartData] = useRecoilState(chartDataState);
  const [cycle, setCycle] = useState(-1);
  const [totalCycle, setTotalCycle] = useState(0);
  const [isPause, setIsPause] = useState(true);
  const [plotCount, setPlotCount] = useState(0);
  const [waveData, setWaveData] = useState([] as any);
  const [offsetData, setOffsetData] = useState([] as any);
  const [waveIndex, setWaveIndex] = useState([] as any);
  const [isAmpChart, setIsAmpChart] = useState(false);
  const [ampIndex, setAmpIndex] = useState([]);
  const [ampData, setAmpData] = useState([] as any);
  const [tv, setTv] = useState(24.2);
  const [tvSeq, setTvSeq] = useState(5);
  // const [iCount, setICount] = useState(144);
  const [maxAmp, setMaxAmp] = useState({ freq: 0, amp: 0 });
  const [threshold, setThreshold] = useState([] as any);

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

    return _.flatten(result);
  };

  const createThreshold = (chunkData: any[]) => {
    let maxPlotInCycle = [];
    for (let i = 0; i < chunkData.length; i++) {
      const maxPlot = Number(_.max(chunkData[i]));

      if (maxPlot > tv) {
        maxPlotInCycle.push({
          cycle: i,
          maxPlot: maxPlot,
          warn: 0,
          position: 0,
        });
      }
    }

    const result = checkThresholdIndex(maxPlotInCycle, tvSeq);
    console.log(result);

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

    console.log(maxPlotInCycle);

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
      const temp = getTdAmp(waveData[cycle % totalCycle]);
      setAmpIndex(temp.frequencies);
      setAmpData(temp.fdAmp);
      setCycle((prev) => (prev + 1) % totalCycle);
    }
  }, 1000);

  const onChangeTv = (event: any) => {
    setTv(event.target.value);
  };

  const onClickSetTv = () => {
    setThreshold(createThreshold(offsetData));
  };

  const onChangeSeq = (event: any) => {
    setTvSeq(event.target.value);
  };

  // const onClickSetSeq = () => {
  //   setThreshold(createThreshold(offsetData));
  // };

  const onClickIsAmpChart = () => {
    setIsAmpChart(!isAmpChart);
    // setCycle(cycle);
  };

  const onClickPause = () => {
    setIsPause(!isPause);
    setCycle(cycle);
  };

  const onClickReset = () => {
    setCycle(-1);
    setPlotCount(0);
    setTotalCycle(0);
    setAmpData([]);
    tdAmpData = _.fill(Array(4096 * 2), 0);
    setIsPause(true);
  };

  const onClickPrev = () => {
    console.log("Prev: " + cycle);
    if (cycle > 0) setCycle((prev) => (prev - 1) % totalCycle);
    // setAmpData([]);
    setIsPause(true);
  };

  const onClickNext = () => {
    console.log("Next: " + cycle);
    if (cycle < totalCycle - 1) setCycle((prev) => (prev % totalCycle) + 1);
    // setAmpData([]);
    setIsPause(true);
  };

  const onClickWarn = (event: any) => {
    setIsPause(true);
    console.log("current id:", event.currentTarget.id);
    setCycle(event.currentTarget.id);
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
            setTotalCycle(chunkedData.length);
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
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ minWidth: "500px" }}>
          cycle: {cycle} / totalCycle: {totalCycle} / count: {plotCount}
        </div>
        <div>
          threshold:{" "}
          <input
            type="text"
            style={{ maxWidth: "60px" }}
            value={tv}
            onChange={onChangeTv}
          />{" "}
          seq:{" "}
          <input
            type="text"
            style={{ maxWidth: "60px" }}
            value={tvSeq}
            onChange={onChangeSeq}
          />
          <button onClick={onClickSetTv}>Apply</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            minWidth: "500px",
            maxHeight: "300px",
            border: "1px solid #cccccc",
          }}
        >
          <WaveChart
            index={waveIndex[cycle]}
            count={cycle}
            plots={waveData[cycle]}
          />

          {cycle > -1 && (
            <div>
              <input
                type="range"
                min="0"
                max={totalCycle - 1}
                value={cycle}
                onChange={(e) => setCycle(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          )}
          <div>
            {cycle > -1 && !isPause && (
              <button onClick={onClickPause}>Pause</button>
            )}
            {cycle > -1 && isPause && (
              <button onClick={onClickPause}>Resume</button>
            )}
            {cycle > -1 && <button onClick={onClickReset}>Reset</button>}
            {cycle > -1 && !isAmpChart && (
              <button onClick={onClickIsAmpChart}>Show AmpChart</button>
            )}
            {cycle > -1 && isAmpChart && (
              <button onClick={onClickIsAmpChart}>Hide AmpChart</button>
            )}
            {cycle > -1 && isPause && (
              <button onClick={onClickPrev}>Prev</button>
            )}
            {cycle > -1 && isPause && (
              <button onClick={onClickNext}>Next</button>
            )}
          </div>
        </div>
        <div
          style={{
            minWidth: "500px",
            maxHeight: "300px",
            border: "1px solid #cccccc",
            overflow: "auto",
          }}
        >
          {threshold.map((el: any, index: number) => (
            <div key={el.cycle} id={el.cycle} onClick={onClickWarn}>
              {el.warn > 0 &&
                `${el.cycle}: ${el.maxPlot} [${el.warn}/${el.position}]`}
            </div>
          ))}
        </div>
      </div>

      {isAmpChart && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              minWidth: "500px",
              maxHeight: "300px",
              border: "1px solid #cccccc",
            }}
          >
            maxAmp: {maxAmp.freq} / {maxAmp.amp}
            <AmpChart index={ampIndex} count={cycle} plots={ampData} />
          </div>
          <div
            style={{
              minWidth: "500px",
              maxHeight: "300px",
              border: "1px solid #cccccc",
            }}
          ></div>
        </div>
      )}
    </>
  );
}
