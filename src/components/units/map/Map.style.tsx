import { css, styled } from "styled-components";
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />;

export const ImageWrapper = styled.div`
  position: relative;

  max-width: 100%;
  max-height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImageWrapper2 = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => {
    return css`
      border: 1px solid ${(props) => props.theme.border};
      background-color: ${(props) => props.theme.mapBackground};
    `;
  }}
`;

export const StyledImage = styled.img`
  position: relative;

  object-fit: contain;
`;

export const RedDot = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: red;
`;

export const PositionedButton = styled.button`
  position: absolute;
  font-size: ${(props) => props.fontSize};
  font-weight: bold;
  border-radius: 10px;
  transition: all 0.3s;
  cursor: pointer;
  padding: 0 15px;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.mapButton};
      border: 1px solid ${(props) => props.theme.buttonBorder};
      color: ${(props) => props.theme.text};
    `;
  }}

  &:hover,
  &:focus {
    color: #40a9ff;
    border-color: #40a9ff;
  }
`;
