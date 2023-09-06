import styled from "@emotion/styled";

export const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  gap: 15px; // 글자와 폴더 사이의 간격을 15px로 설정
  text-align: center;

  & > span {
    // device.name의 스타일을 변경
    font-weight: bold; // 두꺼운 글씨
    font-family: "Noto Sans KR", sans-serif; // 예시로 Noto Sans KR 글씨체 사용
  }
`;

export const Avatar = styled.div`
  font-size: 100px;
`;
