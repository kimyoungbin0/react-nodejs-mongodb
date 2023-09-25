import { css, styled } from "styled-components";

export const LeftWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
  gap: 8px;
`;

export const SwitchWrapper = styled.div`
  margin-top: 4px;
`;

export const LocationWrapper = styled.div`
  height: 95%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 5px;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.rightMenu} !important;
      border: 1px solid ${(props) => props.theme.treeSelectBorder} !important;
      color: ${(props) => props.theme.text};
    `;
  }}
`;

export const StyledButton = styled.button`
  height: 100%;
  width: 4%;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 5px;
  transition: all 0.3s;
  cursor: pointer;
  padding: 0 15px;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.button} !important;
      color: ${(props) => props.theme.text};
      border: 1px solid ${(props) => props.theme.border};
      &:focus {
        background-color: ${(props) => props.theme.button};
      }
    `;
  }}

  &:hover,
  &:focus {
    color: #40a9ff;
    border-color: #40a9ff;
  }
`;
