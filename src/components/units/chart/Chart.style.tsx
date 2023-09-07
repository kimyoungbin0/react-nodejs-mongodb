import { css, styled } from "styled-components";
// Update the path accordingly

export const StyledSpace = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 100vh; /* 화면의 높이만큼 최대 높이를 제한합니다. */
  overflow-y: auto; /* 세로 스크롤을 가능하게 합니다. */
  height: 100%;
  width: 100%;
  margin: 10px;
  padding: 5px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;

  ${({ theme }) => {
    return css`
      background-color: ${(props) => props.theme.rightMenu};
      border: 1px solid ${(props) => props.theme.border};
    `;
  }}
`;
