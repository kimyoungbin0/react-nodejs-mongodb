import * as styledComponents from "styled-components";
import "styled-components";

const color = {
  correct: "#5babab",
  present: "#fdb800",
  absent: "#908790",
};

export const dark = {
  leftStyledMenu: "#3e4146",
  leftStyledMenuText: "white",
  ContentContainer: "#313036", // 다이얼로그
  text: "white",
  rightMenu: "#1e1d23",
  RecentWrapper: "#242426",
  border: "#1e1d23",
  select: "black",
  treeSelectBorder: "#1e1d23",
  button: "black", // 활성화시
  buttonBorder: "white",
  mapButton: "black",
  mapBackground: "black",
  backgroundImage: "url('/images/logo3.png')",
  hover: "black",

  color: { ...color },
};

export const light = {
  leftStyledMenu: "#49536C",
  leftStyledMenuText: "white",
  ContentContainer: "#F5F6FA", // 다이얼로그
  text: "black",
  rightMenu: "white",
  RecentWrapper: "#F5F6FA",
  border: "#cccccc",
  select: "white",
  treeSelectBorder: "#cccccc",
  button: "white", // 활성화시
  buttonBorder: "#cccccc",
  mapButton: "white",
  mapBackground: "white",
  backgroundImage: "url('/images/logo5.png')",
  hover: "#cccccc",

  color: { ...color },
};

export const theme = {
  dark,
  light,
};
