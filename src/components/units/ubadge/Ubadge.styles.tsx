import { css, styled } from "styled-components";
import { createGlobalStyle } from "styled-components";

export const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  text-align: center;
  flex-basis: 10%;
  margin: 10px;
`;

export const Avatar = styled.div`
  font-size: 100px;
`;

export const DeviceName = styled.span`
  ${({ theme }) => {
    return css`
      color: ${(props) => props.theme.text};
    `;
  }}
`;

export const StyledSpace = styled.div`
  display: flex;
  flex-wrap: wrap;
  //max-height: 100vh;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  margin: 10px;
  color: #217af4;
  border-radius: 5px;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.rightMenu};
      box-shadow: ${(props) => props.theme.border};
      border: 1px solid ${(props) => props.theme.border};
    `;
  }}

  /* 커스텀 스크롤바 스타일 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    height: 30%;
    background: #217af4;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(33, 122, 244, 0.1);
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
`;
