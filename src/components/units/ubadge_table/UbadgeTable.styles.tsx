import styled from "@emotion/styled";

export const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  gap: 15px;
  text-align: center;

  & > span {
    // device.name의 스타일을 변경
    font-weight: bold; // 두꺼운 글씨
    font-family: "Noto Sans KR", sans-serif;
  }
`;

export const Avatar = styled.div`
  font-size: 100px;
`;
