import React from "react";
import * as S from "./ChangeButton.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faFolder } from "@fortawesome/free-solid-svg-icons";

const ChangeButton: React.FC<any> = (props) => {
  const onClick = (newValue: string) => {
    props.setValue(newValue);
  };

  return (
    <>
      <S.PlusWrapper onClick={props.handleSwitchChange}>
        {props.isMapVisible ? <FontAwesomeIcon icon={faFolder} size="xl" /> : <FontAwesomeIcon icon={faLocationDot} size="xl" />}{" "}
      </S.PlusWrapper>
    </>
  );
};

export default ChangeButton;
