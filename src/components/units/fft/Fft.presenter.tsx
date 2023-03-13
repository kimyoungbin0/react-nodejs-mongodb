import { addCommas } from "../../../commons/libraries/utils";
import AmpFft from "../../chart/ampFft";
import * as S from "./Fft.styles";
import type { FftUIProps } from "./Fft.types";

export default function FftUI(props: FftUIProps) {
  const {
    cycle = -1,
    isPause = true,
    cycles = 0,
    plotCount = 0,
    ms = 1000,
    tv = 15,
    minFreq = 0,
    maxFreq = 100,
    scale = 32,
    ampIndex,
    ampData,
    minY = 0,
    maxY = 0,
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
          ms: <S.NumberInput id={"ms"} type={"number"} defaultValue={ms} />
          tv: <S.NumberInput id={"tv"} type={"number"} defaultValue={tv} />
          min:{" "}
          <S.NumberInput
            id={"minFreq"}
            type={"number"}
            defaultValue={minFreq}
          />
          max:{" "}
          <S.NumberInput
            id={"maxFreq"}
            type={"number"}
            defaultValue={maxFreq}
          />
          1/scale:{" "}
          <S.NumberInput id={"scale"} type={"number"} defaultValue={scale} />
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
            {cycle > -1 && !isPause && (
              <S.ControlButton onClick={onClickPause}>Pause</S.ControlButton>
            )}
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
