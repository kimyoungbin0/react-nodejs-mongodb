import { addCommas } from "../../../commons/libraries/utils";
import AmpFft from "../../chart/ampFft";
import * as S from "./Fft.styles";
import type { FftUIProps } from "./Fft.types";

export default function FftUI(props: FftUIProps) {
  const {
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
    onClickPrev,
    onClickNext,
    onChangeCycle,
  } = props;

  return (
    <>
      <S.Wrapper>
        <S.CycleWrapper>
          cycle: {cycle} / cycles: {cycles} / plots: {addCommas(plotCount)}
        </S.CycleWrapper>
        <S.ControlWrapper>
          ms:{" "}
          <input
            id="ms"
            type="number"
            step={100}
            style={{ maxWidth: "60px" }}
            defaultValue={ms}
          />{" "}
          tv:{" "}
          <input
            id="tv"
            type="number"
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={tv}
          />{" "}
          min:{" "}
          <input
            id="minFreq"
            type="number"
            min={0}
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={minFreq}
          />{" "}
          max:{" "}
          <input
            id="maxFreq"
            type="number"
            min={0}
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={maxFreq}
          />{" "}
          1/scale:{" "}
          <input
            id="scale"
            type="number"
            step={1}
            style={{ maxWidth: "60px" }}
            defaultValue={scale}
          />
          <S.ControlButton onClick={onClickApply}>Apply</S.ControlButton>
        </S.ControlWrapper>
      </S.Wrapper>
      <S.Wrapper>
        <S.ChartWrapper>
          <AmpFft
            index={ampIndex}
            count={cycle}
            plots={ampData}
            tv={tv}
            minY={minY}
            maxY={maxY}
          />
          {cycle > -1 && (
            <S.ControlWrapper>
              <input
                type="range"
                min="0"
                max={cycles - 1}
                value={cycle}
                onChange={(e) => {
                  onChangeCycle(Number(e.target.value));
                }}
                style={{ width: "100%" }}
              />
            </S.ControlWrapper>
          )}
          <S.ControlWrapper>
            {cycle > -1 && !isPause && (
              <S.ControlButton onClick={onClickPause}>Pause</S.ControlButton>
            )}
            {cycle > -1 && isPause && (
              <S.ControlButton onClick={onClickPause}>Resume</S.ControlButton>
            )}
            {cycle > -1 && isPause && (
              <S.ControlButton onClick={onClickPrev}>Prev</S.ControlButton>
            )}
            {cycle > -1 && isPause && (
              <S.ControlButton onClick={onClickNext}>Next</S.ControlButton>
            )}
          </S.ControlWrapper>
        </S.ChartWrapper>
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
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {cycle > -1 &&
                tvIndexTop.map((data: any) => (
                  <tr key={`${data[0]}-${data[1]}`}>
                    <td>{data[0]}</td>
                    <td>{data[1]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </S.TableWrapper>
      </S.Wrapper>
    </>
  );
}
