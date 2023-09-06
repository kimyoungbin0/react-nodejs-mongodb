import { css, styled } from "styled-components";
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />;

export const ImageWrapper = styled.div`
  position: relative;

  max-width: 100%; /* 이미지의 최대 너비를 컨테이너의 너비로 설정합니다. */
  max-height: 100%; /* 이미지의 최대 높이를 컨테이너의 높이로 설정합니다. */

  display: flex; /* 추가 */
  justify-content: center; /* 추가 */
  align-items: center; /* 추가 */
`;

export const ImageWrapper2 = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 5px;

  display: flex; /* 추가 */
  justify-content: center; /* 추가 */
  align-items: center; /* 추가 */

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
  font-weight: bold; // Add this line
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
