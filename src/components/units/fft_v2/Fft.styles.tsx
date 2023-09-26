import { InputNumber } from "antd";
import { lightenDarkenColor } from "react-papaparse";
import { css, styled } from "styled-components";
import { Select } from "antd";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  padding: 60px;
`;

export const LeftWrapper = styled.div`
  display: relative;
  flex-direction: column;
  width: 50%;
  height: 100%;
  margin-right: 20px;
`;

export const CsvWrapper = styled.div`
  width: 100%;
  height: 10%;
  margin-bottom: 20px;

  ${({ theme }) => {
    return css`
      color: ${(props) => props.theme.text};
    `;
  }}
`;

export const RightWrapper = styled.div`
  display: relative;
  flex-direction: row;
  flex-wrap: wrap;
  width: 50%;
  height: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 47%;
  width: 100%;
  justify-content: center;
  align-items: center;

  justify-content: center; /* 추가 */
  align-items: center; /* 추가 */

  border-radius: 5px;
  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.rightMenu};
      border: 1px solid ${(props) => props.theme.border};
      color: ${(props) => props.theme.text};
    `;
  }}
`;

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
  /* overflow: auto; */
  /* border: 1px solid #cccccc; */
`;

export const CycleWrapper = styled.div`
  margin-right: 5%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const ControlButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const SettingWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const ControlWrapper = styled.div`
  height: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const ControlsWrapper = styled.div`
  height: 6%;
  padding: 0.5%;
`;

export const ControlButton = styled.button`
  margin: 0 5px;
  border-radius: 5px;
  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.ContentContainer};
      color: ${(props) => props.theme.text};
      border: 1px solid ${(props) => props.theme.border};
    `;
  }}
`;

// export const NumberInput = styled.input`
//   max-width: 55px;
// `;

export const AntdInputNumber = styled(InputNumber)`
  max-width: 55px;
`;

export const RangeInput = styled.input`
  width: 100%;
`;

export const PipeWrapper = styled.div`
  width: 100%;
  padding: 20px;
  border: 1px solid #cccccc;
  /* background-color: #bc960d; */
  background-image: url("/images/pipe_bg.jpg");
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const PipeBlock = styled.div`
  min-width: 20%;
  padding: 10px;
  background-color: #d3d3d386;
  border: 1px solid darkgray;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

// export const PipeBlockLeak = styled.div`
//   min-width: 20%;
//   padding: 10px;
//   color: white;
//   background-color: red;
//   border: 1px solid darkgray;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   font-weight: 800;
// `;

export const PipeBlockLeak = styled.div<SensorBlockLeakProps>`
  min-width: 20%;
  padding: 10px;
  color: white;
  background-color: red;
  border: 1px solid darkgray;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 800;

  animation: blink ${({ ms }) => ms} infinite;

  @keyframes blink {
    50% {
      background-color: #ff6666;
    }
  }

  ${({ isPause }) =>
    isPause &&
    `
    animation: none;
  `}
`;

export const SensorBlock = styled.div`
  min-width: 20%;
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

interface SensorBlockLeakProps {
  isPause: boolean;
  ms?: string;
}

export const SensorBlockLeak = styled.div<SensorBlockLeakProps>`
  min-width: 10%;
  padding: 10px;
  color: white;
  background-color: red;
  border: 1px solid #cccccc;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: 800;

  animation: blink ${({ ms }) => ms} infinite;

  @keyframes blink {
    50% {
      background-color: #ff6666;
    }
  }

  ${({ isPause }) =>
    isPause &&
    `
    animation: none;
  `}
`;

export const ThresholdBlock = styled.div`
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

export const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 20%;
  padding: 10px;
`;

export const RecentControlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
`;

export const StyledSelect = styled(Select)`
  margin-left: 10px;
`;

export const DatePicker = styled(Select)`
  &&& .ant-select-selector {
    ${({ theme }) => {
      return css`
        background-color: ${(props) => props.theme.select};
        color: ${(props) => props.theme.text};
      `;
    }}
  }
`;

export const SectionRecentWrapper = styled.div`
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 78%; // 수정된 값


  /* 커스텀 스크롤바 스타일 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    height: 30%;
    background: #217af4;
    border-radius: 10px;


  ::-webkit-scrollbar-track {
    background: rgba(33, 122, 244, 0.1);
  }
`;

export const RecentButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  padding: 10px;
`;

export const SectionTitle = styled.h2`
  display: flex;
  font-size: 1.5rem;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;

  @media (max-width: 1400px) {
    /* When the screen width is between 768px and 1024px */
    font-size: 0.9rem;
    margin-bottom: 0px;
  }

  @media (max-width: 768px) {
    /* 화면 너비가 768px 이하인 경우 */
    font-size: 0.6rem;
    margin-bottom: 0px;
  }
`;

export const RecentWrapper = styled.div`
  display: flex;
  border-radius: 5px;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 96%;
  height: 20%;
  border-bottom: 1px solid #cccccc;
  margin: 2px !important;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.RecentWrapper};
      border: 1px solid ${(props) => props.theme.border};
      &:hover {
        background-color: ${(props) => props.theme.hover};
    `;
  }}

  &:active {
    background-color: #096dd9;
  }
  cursor: pointer;
`;

export const RecentItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px 15px;

  @media (max-width: 768px) {
    padding: 0px;
  }
`;

export const LeakPositionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 10%;

  @media (max-width: 768px) {
    margin: 5px;
  }
`;

export const RecentWarnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px 15px;

  @media (max-width: 768px) {
    justify-content: center;

    margin-right: 3px;
  }
`;

export const empty = styled.div`
  height: 6%;
`;

export const RecentActivity = styled.div`
  height: 47%;
  width: 100%;
  border-radius: 5px;
  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.rightMenu};
      border: 1px solid ${(props) => props.theme.border};
      color: ${(props) => props.theme.text};
    `;
  }}
`;

export const ResultWrapper = styled.div`
  height: 47%;
  width: 100%;
  border-radius: 5px;
  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.rightMenu};
      border: 1px solid ${(props) => props.theme.border};
      color: ${(props) => props.theme.text};
    `;
  }}
`;

export const ResultBox = styled.div`
  height: 100%;
  width: 50%;
  border-radius: 5px;
  padding: 3%;
`;

export const ResultRow = styled.div`
  display: flex;
  height: 50%;
  width: 100%;
`;

export const Box = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 5px;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.RecentWrapper};
      border: 1px solid ${(props) => props.theme.border};
    `;
  }}
`;

export const Result = styled.div`
  position: relative;
  top: 5%;
  left: 0%;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;

  @media (max-width: 1400px) {
    /* When the screen width is between 768px and 1024px */
    font-size: 0.9rem;
  }

  ${({ theme }) => {
    return css`
      color: ${(props) => props.theme.text};
    `;
  }}
`;
export const LeakPosition = styled.span`
  font-size: 1.2rem;
  line-height: 1.5rem;
  font-weight: 500;

  @media (max-width: 1400px) {
    /* When the screen width is between 768px and 1024px */
    font-size: 0.9rem;
  }
`;

export const RecentType = styled.span`
  font-size: 0.8rem;
  font-weight: 500;

  @media (max-width: 1400px) {
    font-size: 0.5rem;
  }

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

export const RecentItem = styled.span`
  font-size: 1rem;
  font-weight: 300;
`;

export const RecentWarn = styled.span`
  font-size: 1.3rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: red;

  @media (max-width: 1400px) {
    /* When the screen width is between 768px and 1024px */
    font-size: 0.9rem;
    margin-bottom: 0px;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const ButtonText = styled.span`
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
`;

export const GREY = "#CCC";
export const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
export const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
export const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);
export const GREY_DIM = "#686868";

export const styles = {
  zone: {
    alignItems: "center",
    border: `2px dashed ${GREY}`,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
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
