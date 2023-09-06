import React, { useEffect } from "react";
import { Avatar, Badge, Space } from "antd";
import * as S from "./Ubadge.styles";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faSatelliteDish } from "@fortawesome/free-solid-svg-icons";

const Ubadge: React.FC<any> = (props) => {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const onClickBadgeButton = (item, preValue, setValue) => {
    if (props.isMapVisible === true) {
      //
    } else {
      if (item.name.includes("#")) {
        window.location.href = "/fft";
      } else {
        setValue(preValue + "/" + item.name);
      }
    }
  };

  return (
    <>
      <S.StyledSpace>
        {props.devices &&
          props.devices
            .filter((device) => device.location === props.value && device.email === email)
            .map((device, index) => (
              <S.BadgeWrapper key={index}>
                <a key={index} onClick={() => onClickBadgeButton(device, props.value, props.setValue)}>
                  {device.name.includes("#") ? (
                    <FontAwesomeIcon icon={faSatelliteDish} size="3x" style={{ color: "#e00b0b" }} />
                  ) : (
                    <FontAwesomeIcon icon={faFolder} size="3x" />
                  )}
                </a>
                <S.DeviceName>{device.name}</S.DeviceName>
              </S.BadgeWrapper>
            ))}
      </S.StyledSpace>
    </>
  );
};

export default Ubadge;
