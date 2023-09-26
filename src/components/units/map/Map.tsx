import React, { useEffect, useState, useMemo, useRef } from "react";
import * as L from "./Map.style";
import { useSession } from "next-auth/react";

async function fetchData(location, name) {
  const response = await fetch(`/api/devices?location=${location}&name=${name}`);
  const data = await response.json();
  return data;
}

const calculateButtonPosition = (mapTopLeft, mapBottomRight, buttonCoords) => {
  const [mapTopLeftLat, mapTopLeftLong] = mapTopLeft;
  const [mapBottomRightLat, mapBottomRightLong] = mapBottomRight;
  const [buttonLat, buttonLong] = buttonCoords;

  const left = ((buttonLong - mapTopLeftLong) / (mapBottomRightLong - mapTopLeftLong)) * 100;
  const top = ((buttonLat - mapTopLeftLat) / (mapBottomRightLat - mapTopLeftLat)) * 100;

  return { left: `${left}%`, top: `${top}%` };
};

const calculateButtonSize = (mapWidth, mapHeight) => {
  const buttonWidth = mapWidth * 0.1;
  const buttonHeight = mapHeight * 0.07;
  const fontSize = Math.min(buttonWidth, buttonHeight) * 0.35;

  return { width: `${buttonWidth}px`, height: `${buttonHeight}px`, fontSize: `${fontSize}px` };
};

export default function Map(props) {
  const [imageSrc, setImageSrc] = useState(null);
  const [showButton, setShowButton] = useState(true);
  const [imageSize, setImageSize] = useState({});
  const [choiceSize, setChoiceSize] = useState({});
  const [buttonSize, setButtonSize] = useState({ width: "auto", height: "auto" });
  const [pointSize, setPointSize] = useState({ width: "auto", height: "auto" });
  const [buttonFontSize, setButtonFontSize] = useState("1rem");
  const [mapTopLeft, setMapTopLeft] = useState(null);
  const [mapBottomRight, setMapBottomRight] = useState(null);
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const imageWrapperRef = useRef(null);
  const imageWrapper2Ref = useRef(null);

  const handleClick = (buttonText) => {
    if (buttonText.includes("#")) window.location.href = "/fft";
    else props.setValue(props.value + "/" + buttonText);
  };

  useEffect(() => {
    setEmail(session?.user?.email ?? "");
  }, [session]);

  const buttonCoords = useMemo(() => {
    const coords = {};

    for (let device of props.devices) {
      if (device.location === props.value && device.email == email) {
        coords[device.name] = [device.latLong.latitude, device.latLong.longitude];
      }
    }

    return coords;
  }, [props.devices, props.value]);

  const buttonPositions = {};

  for (let button in buttonCoords) {
    if (mapTopLeft && mapBottomRight) {
      buttonPositions[button] = calculateButtonPosition(mapTopLeft, mapBottomRight, buttonCoords[button]);
    }
  }

  useEffect(() => {
    const fetchImageData = async () => {
      const splitValue = props.value.split("/");
      const name = splitValue.pop();
      const location = splitValue.join("/");

      const response = await fetch(`/api/devices?location=${location}&name=${name}`);
      const data = await response.json();

      if (props.value === "All") {
        if (props.theme == "lightTheme") setImageSrc("/images/empty_white.png");
        else setImageSrc("/images/empty.png");
      } else if (data[0] && data[0]._id) {
        setImageSrc(`/uploads/${data[0]._id}.png?timestamp=${new Date().getTime()}`);
      } else {
        setImageSrc("/images/default.png");
      }
    };

    fetchImageData();
  }, [props.value, props.refreshImage]);

  useEffect(() => {
    async function loadCoords() {
      const splitValue = props.value.split("/");
      const name = splitValue.pop();
      const location = splitValue.join("/");

      const data = await fetchData(location, name);

      if (data[0] && data[0].size) {
        setMapTopLeft([data[0].size.latitude_L, data[0].size.longitude_L]);
        setMapBottomRight([data[0].size.latitude_R, data[0].size.longitude_R]);
      }
    }

    // 비동기 함수를 호출합니다.
    loadCoords();
  }, [props.value]);

  useEffect(() => {
    const updateButtonSize = () => {
      const img = new Image();
      img.onload = () => {
        if (imageWrapperRef.current) {
          const width = imageWrapperRef.current.offsetWidth;
          const height = imageWrapperRef.current.offsetHeight;

          const buttonAttributes = calculateButtonSize(width, height);
          const pointAttributes = calculateButtonSize(width / 2, height / 2);
          setButtonSize({ width: buttonAttributes.width, height: buttonAttributes.height });
          setPointSize({ width: pointAttributes.height, height: pointAttributes.height });
          setButtonFontSize(buttonAttributes.fontSize);
        }
        if (imageWrapper2Ref.current) {
          const width = imageWrapper2Ref.current.offsetWidth * 0.98;
          const height = imageWrapper2Ref.current.offsetHeight * 0.98;

          setImageSize({ maxWidth: `${width}px`, maxHeight: `${height}px` });
        }
        if (imageWrapperRef.current && imageWrapper2Ref.current) {
          const wrapWidth = imageWrapper2Ref.current.offsetWidth;
          const wrapheight = imageWrapper2Ref.current.offsetHeight;

          const imgWidth = imageWrapperRef.current.offsetWidth;
          const imgHeight = imageWrapperRef.current.offsetHeight;

          if (wrapWidth - imgWidth > wrapheight - imgHeight) {
            setChoiceSize({ height: "100%" });
          } else {
            setChoiceSize({ width: "100%" });
          }
        }
      };
      img.src = imageSrc;
    };

    // 이미지가 로딩된 후에 크기를 측정하고 업데이트합니다.
    updateButtonSize();

    // 화면 크기가 변경될 때마다 버튼 크기를 업데이트합니다.
    window.addEventListener("resize", updateButtonSize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => window.removeEventListener("resize", updateButtonSize);
  }, [imageSrc]);

  return (
    <L.ImageWrapper2 ref={imageWrapper2Ref}>
      <L.ImageWrapper style={{ ...choiceSize }}>
        {imageSrc && <L.StyledImage src={imageSrc} ref={imageWrapperRef} alt="설계도" style={{ ...imageSize, ...choiceSize }} />}
        {showButton && (
          <>
            {Object.keys(buttonCoords).map((key) => {
              if (key.includes("#")) {
                return <L.RedDot key={key} style={{ ...buttonPositions[key], ...pointSize }} onClick={() => handleClick(key)} />;
              }
              return (
                <L.PositionedButton key={key} style={{ ...buttonPositions[key], ...buttonSize, fontSize: buttonFontSize }} onClick={() => handleClick(key)}>
                  {key}
                </L.PositionedButton>
              );
            })}
          </>
        )}
      </L.ImageWrapper>
    </L.ImageWrapper2>
  );
}
