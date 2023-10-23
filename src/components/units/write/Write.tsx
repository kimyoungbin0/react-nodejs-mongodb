import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import * as S from "./Write.style";
import axios from "axios";
import { Input } from "antd";

const WritePage: React.FC<any> = (props) => {
  // 1. Create states for the input elements
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState(session?.user?.name ?? "");
  const [date, setDate] = useState("");
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}`;
    setDate(formattedDate);
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    console.log(title);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const submit = async (values) => {
    console.log(author);
    setIsSubmitting(true);
    try {
      const response = await axios.get(`/api/counter`);
      const count = response.data;
      const boardResponse = await axios.post(`/api/boards`, { title, content, num: count, author, date, views, likes });
      const response2 = await axios.put(`/api/counter`, { type: "board" });
      if (boardResponse.status === 200) {
        console.log("Update successful!");
        window.location.href = "/board";
      } else {
        console.error("Failed to update:", boardResponse.data);
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("count", count.toString()); // count가 숫자라면 문자열로 변환

      const response3 = await axios.post(`/api/boardupload?count=${count}`, formData);

      if (response3.status === 200) {
        console.log("File uploaded successfully:", response2.data.fileName);
        props.setRefreshImage(!props.refreshImage); // 이미지 새로 고침 상태 변경
      }
    } catch (error) {
      console.error("Error updating device data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 2. Wrap the contents inside a form element

    <S.WriteWrapper>
      <S.WriteButton onClick={submit} disabled={isSubmitting}>
        글 쓰기
      </S.WriteButton>
      <S.TitleBox value={title} onChange={handleTitleChange} placeholder="제목"></S.TitleBox>
      <S.ContentBox value={content} onChange={handleContentChange} placeholder="내용"></S.ContentBox>
      <S.PhotoBox>
        <Input type="file" name="file" onChange={handleFileChange} />
      </S.PhotoBox>
    </S.WriteWrapper>
  );
};

export default WritePage;
