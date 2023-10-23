import React, { useEffect, useState } from "react";
import * as L from "./ChangeName.style";
import { useRouter } from "next/router";
import { Alert } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";

const ChangeName: React.FC<any> = (props) => {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const Name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const [name, setName] = useState(Name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/user?name=true`, {
        password,
        name,
        email,
      });

      if (response.status === 200) {
        console.log("Update successful!");
      } else {
        console.error("Failed to update:", response.data);
      }

      router.push("/account");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <L.page>
        <L.titleWrap></L.titleWrap>
        <L.contentWrap>
          <L.inputTitle> 새 이름</L.inputTitle>
          <L.inputWrap>
            <L.input type="text" value={name} onChange={(e) => setName(e.target.value)} required></L.input>
          </L.inputWrap>
          ​<L.inputTitle>현재 비밀번호</L.inputTitle>
          <L.inputWrap>
            <L.input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></L.input>
          </L.inputWrap>
        </L.contentWrap>
        ​
        <div>
          <L.bottomButton type="submit">변경</L.bottomButton>
        </div>
        <L.alertWrap>{errorMessage && <Alert type="error" message="잘못된 정보입니다" banner />}</L.alertWrap>
      </L.page>
    </form>
  );
};

export default ChangeName;
