import { css, styled } from "styled-components";
import { lightenDarkenColor } from "react-papaparse";
import { Select } from "antd";

export const RightWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  padding: 10px;
  margin-left: 10px;

  border-radius: 5px;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.rightMenu};
      border: 1px solid ${(props) => props.theme.border};
      color: ${(props) => props.theme.text};
    `;
  }}

  @media (max-width: 768px) {
    /* 화면 너비가 768px 이하인 경우 */
    width: 95%; /* 모바일 환경에서의 너비 설정 */
    margin: 10px;
    align-items: center;
  }
`;

export const SectionRecentWrapper = styled.div`
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 90%; // 수정된 값


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

export const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 10%;
  padding: 10px;

  @media (max-width: 768px) {
    /* 화면 너비가 768px 이하인 경우 */
    height: 50px; /* 모바일 환경에서의 너비 설정 */
    border-bottom: 0px solid black;
  }
`;

export const RecentControlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
`;

export const RecentButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  padding: 10px;
`;

export const SectionTitle = styled.h2`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 1.5rem;
  align-items: center;

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
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 98%;
  height: 10%;
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

export const LeakPosition = styled.span`
  font-size: 1.2rem;
  line-height: 1.5rem;
  font-weight: 500;

  @media (max-width: 1400px) {
    /* When the screen width is between 768px and 1024px */
    font-size: 0.9rem;
    margin-bottom: 0px;
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
    margin: 5px;
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
  ${({ theme }) => {
    return css`
      color: ${(props) => props.theme.text};
    `;
  }}
`;

export const StyledSelect = styled(Select)`
  &&& .ant-select-selector {
    ${({ theme }) => {
      return css`
        background-color: ${(props) => props.theme.select};
        color: ${(props) => props.theme.text};
      `;
    }}
  }
`;

export const Circle = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px; /* 동그라미와 텍스트 사이의 간격을 조절 */
`;

export const BlueCircle = styled(Circle)`
  background-color: blue;
`;

export const RedCircle = styled(Circle)`
  background-color: red;
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
    maxWidth: "700px",
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
