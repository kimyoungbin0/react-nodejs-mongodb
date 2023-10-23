import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import * as S from "./Read.style";
import axios from "axios";
import { useRouter } from "next/router"; // useRouter import

const ReadPage: React.FC<any> = (props) => {
  // 1. Create states for the input elements
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(session?.user?.name);
  const [date, setDate] = useState("");
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const router = useRouter();
  const { idx } = router.query; // URL의 idx 값을 가져옵니다.

  useEffect(() => {
    // API에서 게시글 정보를 가져오는 로직
    async function fetchBoardData() {
      try {
        const response = await axios.get(`/api/boards?num=${idx}`);
        const boardData = response.data;

        const response2 = await axios.put(`/api/boards`, { num: idx });

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

  useEffect(() => {
    // ... 기존의 게시물 데이터 요청 로직 ...

    async function fetchImages() {
      try {
        const response = await axios.get(`/api/boardupload?count=${idx}`);
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }

    if (idx) {
      fetchImages();
    }
  }, [idx]);

  const onClickEdit = () => {
    window.location.href = `/boardedit?idx=${idx}`;
  };

  const onClickLike = () => {
    async function fetchBoardData() {
      try {
        const response = await axios.put(`/api/boards?likes=true`, { num: idx, likes: likes });
        if (response.status === 200) {
          console.log(" successful!");
        } else {
          console.error("Failed to delete:", response.data);
        }
      } catch (error) {
        console.error("Error fetching board data:", error);
      }
    }
    fetchBoardData();
  };

  const onClickDelete = async () => {
    try {
      const response = await axios.delete(`/api/boards`, {
        data: { num: idx },
      });

      if (response.status === 200) {
        console.log("Deletion successful!");
        window.location.href = `/board`;
      } else {
        console.error("Failed to delete:", response.data);
      }
    } catch (error) {
      console.error("Error deleting device data:", error);
    }
  };

  return (
    // 2. Wrap the contents inside a form elementc

    <S.WriteWrapper>
      <S.ButtonWrapper>
        <S.WriteButton style={{ width: "30px", marginRight: "5px" }} onClick={onClickLike}>
          ❤️
        </S.WriteButton>
        <S.WriteButton onClick={onClickEdit}>수정</S.WriteButton>
      </S.ButtonWrapper>
      <S.TitleBox>{title}</S.TitleBox>
      <S.ContentBox>{content}</S.ContentBox>
      <S.PhotoBox>
        <S.PhotoBox>
          {images.map((image, index) => (
            <a key={index} href={`/uploads/${idx}/${image}`} download>
              {image}
            </a>
          ))}
        </S.PhotoBox>
      </S.PhotoBox>
      <S.WriteButton onClick={onClickDelete}>삭제</S.WriteButton>
    </S.WriteWrapper>
  );
};

export default ReadPage;
