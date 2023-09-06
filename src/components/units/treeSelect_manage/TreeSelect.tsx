import React, { useState, useEffect } from "react";
import { TreeSelect, Button } from "antd";
import * as S from "./TreeSelect.style";
import { LeftOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import { useSession } from "next-auth/react";
import styled from "@emotion/styled";
import { light, dark } from "../../../commons/styles/themes"; // Update the path accordingly

function generateTreeData(devices) {
  const treeData = []; // 트리 데이터를 저장할 배열 초기화
  for (const device of devices) {
    // 모든 장치에 대해 반복
    const pathParts = device.location.split("/"); // 장치 위치를 "/"로 나눠 각 부분을 배열로 저장
    let currentLevel = treeData; // 현재 레벨을 트리의 루트 레벨로 설정
    for (let i = 0; i < pathParts.length; i++) {
      // 장치 위치의 각 부분에 대해 반복
      const part = pathParts[i]; // 현재 부분의 이름
      const value = pathParts.slice(0, i + 1).join("/"); // 현재 부분까지의 전체 경로
      // 현재 레벨의 자식 중에서 현재 부분과 같은 이름을 가진 것을 찾음
      let existingPart = currentLevel.find((child) => child.value === value);
      if (!existingPart) {
        // 같은 이름을 가진 자식이 없으면 새로 만듦
        existingPart = {
          value, // 전체 경로를 값으로 설정
          title: part, // 현재 부분의 이름을 제목으로 설정
          children: [], // 자식을 저장할 배열 초기화
        };
        currentLevel.push(existingPart); // 새로 만든 항목을 현재 레벨의 자식으로 추가
      }
      currentLevel = existingPart.children; // 현재 레벨을 새로 만든 항목의 자식 레벨로 변경
    }
    const value = device.location + "/" + device.name; // 장치의 위치와 이름을 합쳐 값을 만듦
    // 같은 값을 가진 자식이 없으면 새로운 장치를 추가
    if (!currentLevel.find((child) => child.value === value)) {
      currentLevel.push({
        value: value, // 장치의 `_id`를 이용해 고유한 값을 만듦
        title: device.name, // 장치의 이름을 제목으로 설정
        children: [],
      });
    }
  }
  return treeData; // 완성된 트리 데이터를 반환
}

const onPrevButtonClick = (value, setValue) => {
  if (value !== "All") {
    const parentValue = value.substring(0, value.lastIndexOf("/"));
    setValue(parentValue);
  }
};

const StreeManage: React.FC<any> = (props) => {
  const [treeData, setTreeData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email);

  useEffect(() => {
    if (session?.user?.email) {
      // 세션에서 email이 존재하는지 확인
      setEmail(session.user.email); // email 상태를 설정
      // email을 사용하여 API 호출
      getDevicesAndGenerateTreeData(session.user.email)
        .then((data) => setTreeData(data))
        .catch((error) => console.error(error));
    }
  }, [session]); // session의 변화에 따라 useEffect를 재실행

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onChange = (newValue: string) => {
    if (newValue.includes("#")) {
      window.location.href = "/fft";
    }
    props.setValue(newValue);
  };

  async function getDevicesAndGenerateTreeData(session_email) {
    const response = await fetch(`/api/devices?email=${session_email}`);
    const devices = await response.json();
    console.log(devices);
    const treeData = generateTreeData(devices);
    return treeData;
  }
  return (
    <S.LeftWrapper>
      <S.StyledButton icon={<LeftOutlined />} onClick={() => onPrevButtonClick(props.value, props.setValue)} />

      <S.StyledTreeSelect
        showSearch
        style={{ width: "100%", height: "100%" }}
        value={props.value}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={onChange}
        treeData={treeData}
      />

      {isClient &&
        window.location.pathname === "/manage" && ( // 클라이언트 측에서 현재 URL이 '/manage'인지 확인합니다.
          <S.SwitchWrapper>
            <Switch defaultChecked={false} onChange={props.handleSwitchChange} />
          </S.SwitchWrapper>
        )}
    </S.LeftWrapper>
  );
};
export default StreeManage;
