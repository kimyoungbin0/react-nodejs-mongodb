import React, { useState, useEffect } from "react";
import * as S from "./ShowLocation.style";
import { LeftOutlined } from "@ant-design/icons";
import { Switch } from "antd";

const onPrevButtonClick = (value, setValue) => {
  if (value !== "All") {
    const parentValue = value.substring(0, value.lastIndexOf("/"));
    setValue(parentValue);
  }
};

const ShowLocation: React.FC<any> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <S.LeftWrapper>
      <S.StyledButton onClick={() => onPrevButtonClick(props.value, props.setValue)}>
        <LeftOutlined />
      </S.StyledButton>

      <S.LocationWrapper>{props.value}</S.LocationWrapper>

      {isClient && window.location.pathname === "/manage" && (
        <S.SwitchWrapper>
          <Switch defaultChecked={false} onChange={props.handleSwitchChange} />
        </S.SwitchWrapper>
      )}
    </S.LeftWrapper>
  );
};
export default ShowLocation;
