// styled.jsx
import { css, styled } from "styled-components";

export const ThemeModeWrapper = styled.button`
  position: fixed;
  top: 0;
  left: 4px;
  z-index: 9999;

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
