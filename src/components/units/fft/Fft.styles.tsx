import styled from "@emotion/styled";
import { lightenDarkenColor } from "react-papaparse";

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
  min-width: 400px;
  max-height: 350px;
  overflow: auto;
  border: 1px solid #cccccc;
`;

export const CycleWrapper = styled.div`
  min-width: 300px;
  min-height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const ControlWrapper = styled.div`
  min-width: 500px;
  min-height: 30px;
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const ControlButton = styled.button`
  margin: 0 5px;
`;

export const NumberInput = styled.input`
  max-width: 60px;
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

export const SensorBlockLeak = styled.div`
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
