import styled from "@emotion/styled";
import { InputNumber } from "antd";
import { lightenDarkenColor } from "react-papaparse";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-width: 800px;
  max-width: 100vw;
`;

export const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 810px;
  padding-right: 10px;
  margin-bottom: 10px;
`;

export const RightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
  flex-wrap: wrap;
  width: 100%;
  max-width: 800px;
  min-height: 800px;
  /* max-height: 100vh; */
  border: solid 1px #cccccc;
  padding: 10px;
  margin-bottom: 10px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 800px;
  border: 1px solid #cccccc;
`;

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* min-width: 400px; */
  min-height: 180px;
  max-height: 230px;
  /* overflow: auto; */
  /* border: 1px solid #cccccc; */
`;

export const CycleWrapper = styled.div`
  min-width: 300px;
  min-height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const SettingWrapper = styled.div`
  min-width: 500px;
  min-height: 30px;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const ControlWrapper = styled.div`
  min-width: 500px;
  min-height: 30px;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const ControlButton = styled.button`
  margin: 0 5px;
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
  max-width: 800px;
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

export const PipeBlockLeak = styled.div`
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
  flex-wrap: wrap;
  width: 100%;
  height: 80px;
  padding: 10px;
  border-bottom: 1px solid #cccccc;
  overflow: auto;
`;

export const RecentControlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
`;

export const SectionRecentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  min-height: 620px;
  max-height: 620px;
  padding: 10px;
  overflow: auto;
`;

export const RecentButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  padding: 10px;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
`;

export const RecentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #cccccc;
`;

export const RecentItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 60px;
  padding: 10px 20px;
`;

export const LeakPositionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 10px;
  border-radius: 50%;
  background-color: red;
`;

export const RecentWarnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 280px;
  height: 60px;
  padding: 10px 50px;
`;

export const LeakPosition = styled.span`
  font-size: 1.5rem;
  line-height: 1.5rem;
  color: white;
`;

export const RecentType = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
`;

export const RecentItem = styled.span`
  font-size: 1rem;
  font-weight: 300;
`;

export const RecentWarn = styled.span`
  font-size: 1.5rem;
  line-height: 1.5rem;
  font-weight: 700;
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
    // height: "100%",
    width: "100%",
    maxWidth: "800px",
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
