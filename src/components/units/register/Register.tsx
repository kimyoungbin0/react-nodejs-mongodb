import React, { useEffect, useState } from "react";
import * as L from "./Register.style";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Alert } from "antd";
import axios from "axios";
import { emit } from "process";

const Register: React.FC<any> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for password confirmation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Send data to API endpoint for registration
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      // Redirect user to login page after successful registration
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const onClickCheck = () => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/user?email=${email}`);
        alert("사용 가능한 아이디입니다");
      } catch (error) {
        if (email) alert("아이디가 존재합니다"); // General error
        else alert("아이디를 입력하시오");
      }
    };

    fetchData();
  };

  return (
    <form onSubmit={handleSubmit}>
      <L.page>
        <L.titleWrap></L.titleWrap>
        <L.contentWrap>
          <L.inputTitle>아이디</L.inputTitle>
          <L.inputWrap>
            <L.input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required></L.input>
          </L.inputWrap>
          <L.checkButton onClick={onClickCheck}>중복확인</L.checkButton>​<L.inputTitle>비밀번호</L.inputTitle>
          <L.inputWrap>
            <L.input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></L.input>
          </L.inputWrap>
          ​<L.inputTitle>비밀번호 확인</L.inputTitle>
          <L.inputWrap>
            <L.input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required></L.input>
          </L.inputWrap>
          <L.inputTitle>이름</L.inputTitle>
          <L.inputWrap>
            <L.input type="text" value={name} onChange={(e) => setName(e.target.value)} required></L.input>
          </L.inputWrap>
        </L.contentWrap>
        ​
        <div>
          <L.bottomButton type="submit">확인</L.bottomButton>
        </div>
        <L.alertWrap>{errorMessage && <Alert type="error" message="잘못된 정보입니다" banner />}</L.alertWrap>
      </L.page>
    </form>
  );
};

export default Register;
