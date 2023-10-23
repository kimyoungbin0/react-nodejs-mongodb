import styled from "@emotion/styled";

export const TitleBox = styled.input`
  display: flex;
  width: 100%;
  height: 5%;
  background-color: white;
  margin: 10px;
  border-radius: 5px;
`;

export const ContentBox = styled.input`
  display: flex;
  width: 100%;
  height: 30%;
  background-color: white;
  margin: 10px;
  border-radius: 5px;
`;

export const PhotoBox = styled.div`
  display: flex;
  width: 100%;
  height: 10%;
  background-color: white;
  margin: 10px;
  border-radius: 5px;
`;

export const WriteWrapper = styled.div`
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  flex-direction: column; /* 내부 요소들을 세로로 정렬 */
  font-size: 100px;
  width: 70%;
  height: 100%;
  border-radius: 5px;
`;

export const WriteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black; /* 흰색 테두리 추가 */
  border-radius: 5px;
  width: 80px;
  height: 30px;
  font-size: 1px;
  margin-left: auto; /* 오른쪽으로 이동 */
`;
