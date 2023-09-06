import React, { use, useEffect, useState } from "react";
import * as L from "./login.style";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Alert, Space } from "antd";
import { gql, useQuery } from "@apollo/client";
const FETCH_USERS = gql`
  query fetchUsers {
    fetchUsers {
      userId
      name
    }
  }
`;
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const query_data = useQuery(FETCH_USERS, {});
  console.log("FETCH_USERS: ", query_data.data?.fetchUsers);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (!result) {
        setErrorMessage("Login was unsuccessful");
      } else if (result.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
    }
  };
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);
  return (
    <form onSubmit={handleSubmit}>
      <L.page>
        <L.titleWrap></L.titleWrap>
        <L.contentWrap>
          <L.inputTitle>아이디</L.inputTitle>
          <L.inputWrap>
            <L.input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required></L.input>
          </L.inputWrap>
          ​<L.inputTitle>비밀번호</L.inputTitle>
          <L.inputWrap>
            <L.input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required></L.input>
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
}
