import styled from "@emotion/styled";

export const PlusWrapper = styled.button`
  width: 80px;
  height: 80px;
  padding: 10px;
  border-radius: 50%;
  position: absolute;
  right: 20px;
  bottom: 55px;
  background-color: #1677ff;
  color: #000;
  border: 1px solid #40a9ff;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 32px;
  font-weight: bold;
  &:hover {
    background-color: white;
  }
  &:active {
    background-color: #096dd9;
  }
`;

export const Avatar = styled.div`
  font-size: 100px;
`;