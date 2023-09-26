import { css, styled } from "styled-components";
// Update the path accordingly

export const StyledSpace = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 100vh;
  overflow-y: auto;
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
