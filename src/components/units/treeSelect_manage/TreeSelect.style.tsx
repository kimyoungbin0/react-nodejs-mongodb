import { css, styled } from "styled-components";
import { light, dark } from "../../../commons/styles/themes"; // Update the path accordingly
import { TreeSelect, Button } from "antd";

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

export const StyledTreeSelect = styled(TreeSelect)`
  height: 100%;
  .ant-select-selector {
    height: 100%;
    ${({ theme }) => {
      return css`
        background-color: ${(props) => props.theme.rightMenu} !important;
        border: 1px solid ${(props) => props.theme.treeSelectBorder} !important;
        color: ${(props) => props.theme.text};
      `;
    }}
  }
`;

export const StyledButton = styled(Button)`
  height: 100%;
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
  &:active,
  &:focus {
    color: white;
  }

  .anticon {
    /* anticon 클래스에 스타일 적용 */
    color: white;
  }
`;
