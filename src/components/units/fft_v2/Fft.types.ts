export interface FftUIProps {
  cycle: number;
  isPause: boolean;
  cycles: number;
  plotCount: number;
  ms: number;
  tv: number;
  minFreq: number;
  maxFreq: number;
  scale: number;
  ampIndex: number[];
  ampData: number[][];
  minY: number;
  maxY: number;
  threshold: number[];
  tvIndexTop: number[];
  onClickApply?: () => void;
  onClickPause?: () => void;
  onClickPrev?: () => void;
  onClickNext?: () => void;
  onChangeCycle?: (cycle: number) => void;
}
