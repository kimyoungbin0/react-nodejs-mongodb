// BoardPage.tsx
import React, { useState, useEffect } from "react";
import * as S from "./Board.style";
import Pagination from "../pagination/pagination"; // Import the Pagination component

interface BoardData {
  num: number;
  title: string;
  author: string;
  date: string;
  views: number;
  likes: number;
}

function BoardPage() {
  const [data, setData] = useState<BoardData[]>([]); // Specify the type for data
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState<BoardData[]>([]);

  useEffect(() => {
    // API 엔드포인트 URL
    const apiUrl = "/api/boards";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data: BoardData[]) => {
        // Specify the type for data here as well
        const sortedData = data.sort((a, b) => b.num - a.num); // 데이터를 내림차순으로 정렬
        setOriginalData(sortedData); // 원본 데이터 저장
        setData(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const postsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const offset = currentPage * postsPerPage;
  const currentPageData = data.slice(offset, offset + postsPerPage);

  const pageCount = Math.ceil(data.length / postsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const onClick = () => {
    window.location.href = "/boardwrite";
  };

  const onClickList = (num) => {
    window.location.href = `/boardread?idx=${num}`;
  };

  const handleSearch = () => {
    if (searchTerm) {
      const filteredData = originalData.filter((item) => item.title.includes(searchTerm));
      setData(filteredData);
    } else {
      setData(originalData); // 검색어가 없을 때 원본 데이터를 복원
    }
  };

  return (
    <S.BoardListStyles>
      <S.Top>
        <S.LeftElement>
          <S.Title>게시판</S.Title>
        </S.LeftElement>
        <S.RightElement>
          <S.SearchBox value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <S.SearchButton onClick={handleSearch}>찾기</S.SearchButton>
        </S.RightElement>
      </S.Top>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th id="title">제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회</th>
            <th>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item, index) => (
            <tr key={item.num} onClick={() => onClickList(item.num)}>
              <td>{item.num}</td>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.date}</td>
              <td>{item.views}</td>
              <td>{item.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
      <S.WriteButton onClick={onClick}>글 쓰기</S.WriteButton>
    </S.BoardListStyles>
  );
}

export default BoardPage;
