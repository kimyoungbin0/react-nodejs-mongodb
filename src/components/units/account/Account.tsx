import React, { useEffect, useState } from "react";
import * as L from "./Account.style";
import { useRouter } from "next/router";
import { Alert } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";

const Account: React.FC<any> = (props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: session } = useSession();
  const Name = session?.user?.name ?? "";
  const [name, setName] = useState(Name);

  const onClickChangePassword = () => {
    window.location.href = "/changePassword";
  };

  const onClickChangeName = () => {
    window.location.href = "/changeName";
  };

  return (
    <>
      <L.page>
        <L.titleWrap></L.titleWrap>
        <L.contentWrap>
          <L.inputTitle>이름</L.inputTitle>
          <L.inputWrap>
            <L.input type="text" value={name}></L.input>
          </L.inputWrap>
        </L.contentWrap>
        ​
        <div>
          <L.bottomButton onClick={onClickChangePassword}>비밀번호 변경</L.bottomButton>
          <L.bottomButton onClick={onClickChangeName}>이름 변경</L.bottomButton>
        </div>
        <L.alertWrap>{errorMessage && <Alert type="error" message="잘못된 정보입니다" banner />}</L.alertWrap>
      </L.page>
    </>
  );
};

export default Account;
