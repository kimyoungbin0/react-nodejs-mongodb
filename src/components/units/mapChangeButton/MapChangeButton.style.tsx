import styled from "@emotion/styled";

export const PlusWrapper = styled.button`
  width: 70px;
  height: 70px;
  padding: 10px;
  border-radius: 50%;
  position: fixed; /* 화면에 고정된 위치 */
  top: 90%; /* 상단에서 50% 위치 */
  left: 95%; /* 왼쪽에서 50% 위치 */
  transform: translate(-50%, -50%); /* 요소의 중심을 화면의 중심으로 이동 */
  background-color: #1677ff;
  color: #000;
  border: 1px solid #1677ff;
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
