import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import * as S from "./Edit.style";
import axios from "axios";
import { useRouter } from "next/router"; // useRouter import

const EditPage: React.FC<any> = (props) => {
  // 1. Create states for the input elements
  const { data: session } = useSession();
  const [title, setTitle] = useState("1");
  const [content, setContent] = useState("2");
  const [author, setAuthor] = useState(session?.user?.name);
  const [date, setDate] = useState("");
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);

  const router = useRouter();
  const { idx } = router.query; // URL의 idx 값을 가져옵니다.

  useEffect(() => {
    // API에서 게시글 정보를 가져오는 로직
    async function fetchBoardData() {
      try {
        const response = await axios.get(`/api/boards?num=${idx}`);
        const boardData = response.data;
        console.log(boardData);
        setTitle(boardData[0].title);
        setContent(boardData[0].content);
        setDate(boardData[0].date);
        setViews(boardData[0].views);
        setLikes(boardData[0].likes);
        // 필요하다면 다른 상태들도 여기에서 설정할 수 있습니다.
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    }

    if (idx) {
      // idx 값이 있을 때만 API 호출
      fetchBoardData();
    }
  }, [idx]); // idx가 변경될 때마다 useEffect가 실행됩니다.

  const submit = async () => {
    try {
      const boardResponse = await axios.put(`/api/boards?title=true`, { title, content, idx, author, date, views, likes });
      const response2 = await axios.put(`/api/counter`, { type: "board" });
      if (boardResponse.status === 200) {
        console.log("Update successful!");
        window.location.href = `/boardread?idx=${idx}`;
      } else {
        console.error("Failed to update:", boardResponse.data);
      }
    } catch (error) {
      console.error("Error updating device data:", error);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  return (
    // 2. Wrap the contents inside a form elementc

    <S.WriteWrapper>
      <S.WriteButton onClick={submit}>수정</S.WriteButton>
      <S.TitleBox value={title} onChange={handleTitleChange} />
      <S.ContentBox value={content} onChange={handleContentChange}></S.ContentBox>
      <S.PhotoBox></S.PhotoBox>
    </S.WriteWrapper>
  );
};

export default EditPage;
