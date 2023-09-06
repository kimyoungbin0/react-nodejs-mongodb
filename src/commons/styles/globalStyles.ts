import { css } from "@emotion/react";

export const globalStyles = (isDarkMode: boolean) => css`
  * {
    margin: 0;
    box-sizing: border-box;
    font-size: 15px;
    font-family: "Roboto", sans-serif; // 글꼴 적용
  }
  /* @font-face {
    font-family: "myfont";
    src: url("/fonts/scifibit.ttf");
  } */
`;
