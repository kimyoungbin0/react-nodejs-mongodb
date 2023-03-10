export interface FftUIProps {
  cycle?: number;
  isPause?: boolean;
  cycles?: number;
  plotCount?: number;
  ms?: number;
  tv?: number;
  minFreq?: number;
  maxFreq?: number;
  scale?: number;
  ampIndex?: number[];
  ampData?: number[][];
  minY?: number;
  maxY?: number;
  threshold?: number[];
  tvIndexTop?: number[];
  onClickApply?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  onClickPause?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  handleResults?: (results?: any) => void;
}
