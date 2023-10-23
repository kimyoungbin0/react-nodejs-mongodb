import React, { useEffect, useState } from "react";
import * as L from "./ChangePassword.style";
import { useRouter } from "next/router";
import { Alert } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";

const ChangePassword: React.FC<any> = (props) => {
  const [password, setPassword] = useState("");

  const [newconfirmPassword, setNewconfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const Name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";
  const [name, setName] = useState(Name);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for password confirmation
    if (newPassword !== newconfirmPassword) {
      setErrorMessage("새로운 비밀번호가 일치하지 않습니다");
      return;
    }

    // Send data to API endpoint for registration
    try {
      const response = await axios.put(`/api/user?password=true`, {
        password,
        newPassword,
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
          ​<L.inputTitle>현재 비밀번호</L.inputTitle>
          <L.inputWrap>
            <L.input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></L.input>
          </L.inputWrap>
          ​<L.inputTitle>새 비밀번호</L.inputTitle>
          <L.inputWrap>
            <L.input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required></L.input>
          </L.inputWrap>
          ​<L.inputTitle>새 비밀번호 확인</L.inputTitle>
          <L.inputWrap>
            <L.input type="password" value={newconfirmPassword} onChange={(e) => setNewconfirmPassword(e.target.value)} required></L.input>
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

export default ChangePassword;
