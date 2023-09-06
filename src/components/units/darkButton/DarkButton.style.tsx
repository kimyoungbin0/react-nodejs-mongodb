// styled.jsx
import { css, styled } from "styled-components";

export const ThemeModeWrapper = styled.button`
  position: fixed;
  top: 0;
  left: 4px;
  z-index: 9999; // 항상 맨 위에 표시되도록 높은 z-index 값 설정

  width: 40px;
  margin: 10px;
  border: none;
  border-radius: 5px;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.rightMenu};
      box-shadow: ${(props) => props.theme.text};
      border: 1px solid ${(props) => props.theme.border};
    `;
  }}
`;
