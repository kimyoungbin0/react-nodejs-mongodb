// Pagination.js
import React from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components"; // styled-components를 import 합니다.

// Pagination 컴포넌트에 스타일을 적용한 컴포넌트를 생성합니다.
const StyledPagination = styled(ReactPaginate)`
  display: flex;
  margin-top: 10px;
  justify-content: center;
  list-style: none;
  padding-left: 0;

  li {
    margin-right: 10px;
    cursor: pointer;
  }

  .active {
    font-weight: bold;
  }

  /* 그 외 필요한 스타일을 추가로 지정합니다. */
`;

function Pagination({ pageCount, onPageChange }) {
  return (
    <StyledPagination
      previousLabel={"이전"}
      nextLabel={"다음"}
      breakLabel={""}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={10}
      onPageChange={onPageChange}
    />
  );
}

export default Pagination;
