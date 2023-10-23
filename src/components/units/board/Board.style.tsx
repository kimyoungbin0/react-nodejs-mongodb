// style.tsx
import styled from "styled-components";

export const BoardListStyles = styled.div`\
  width:80%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;

  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  table th,
  table td {
    padding: 12px 15px;
    border-bottom: 1px solid #dee2e6;
  }

  th[id="title"] {
    width: 60%; /* "제목" 셀 너비를 80%로 설정합니다. */
  }

  table th {
    background-color: #f8f9fa;
    font-weight: bold;
  }

  table tbody tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  table tbody tr:hover {
    background-color: #e0e0e0;
    cursor: pointer;
  }
`;

export const Top = styled.div`\
    display: flex;
    width: 100%;
    height: 10%;
    justify-content: space-between; /* 자식 요소 사이에 공간을 분배하여 왼쪽 끝과 오른쪽 끝에 배치 */
`;

export const LeftElement = styled.div`
  width: 30%;
  height: 100%;
`;

// 오른쪽에 배치할 요소에 스타일을 적용합니다.
export const RightElement = styled.div`
  display: flex;
  width: 30%;
  height: 100%;
  margin-top: 40px;
`;

export const SearchBox = styled.input`\
    width: 70%;
    height: 30px;
    background-color: white;
    color: black; /* 텍스트 색상을 설정 */
    display: flex; /* 내용을 수평으로 배치하기 위해 flex를 사용 */
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
    margin-right:5px;
    border-radius:5px;
`;

export const SearchButton = styled.button`
  width: 30%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black; /* 흰색 테두리 추가 */
  border-radius: 5px;
  &:hover,
  &:focus {
    color: #40a9ff;
    border-color: #40a9ff;
  }
`;
export const Title = styled.div`
  display: flex;
  width: 60%;
  height: 100%;
  font-size: 2.5em;
  margin: 5%;
`;

export const WriteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black; /* 흰색 테두리 추가 */
  border-radius: 5px;
  width: 80px;
  height: 30px;
  font-size: 1em;
  margin-left: auto; /* 오른쪽으로 이동 */
`;
