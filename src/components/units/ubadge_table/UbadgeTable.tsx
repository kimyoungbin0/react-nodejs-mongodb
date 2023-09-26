import React, { useEffect } from "react";
import { Space, Table } from "antd";
import * as S from "./UbadgeTable.styles";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faSatelliteDish } from "@fortawesome/free-solid-svg-icons";

const UbadgeTable: React.FC<any> = (props) => {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const localThemeMode = window.localStorage.getItem("theme");

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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => onClickBadgeButton(record, props.value, props.setValue)}>
          <S.BadgeWrapper>
            {props.isMapVisible ? (
              <>
                <FontAwesomeIcon icon={faFolder} size="1x" />
                <span style={{ color: "black" }}>{text}</span>
              </>
            ) : (
              <>
                {text.includes("#") ? <FontAwesomeIcon icon={faSatelliteDish} size="1x" /> : <FontAwesomeIcon icon={faFolder} size="1x" />}
                <span style={{ color: "black" }}>{text}</span>
              </>
            )}
          </S.BadgeWrapper>
        </a>
      ),
      style: { backgroundColor: "#3e4146" },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => <span style={{ color: "black" }}>{text}</span>,
      style: { backgroundColor: "#3e4146" },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <span style={{ color: "black" }}>{text}</span>,
      style: { backgroundColor: "#3e4146" },
    },
  ];

  const columnsDark = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => onClickBadgeButton(record, props.value, props.setValue)}>
          <S.BadgeWrapper>
            {props.isMapVisible ? (
              <>
                <FontAwesomeIcon icon={faFolder} size="1x" />
                <span style={{ color: "white" }}>{text}</span>
              </>
            ) : (
              <>
                {text.includes("#") ? <FontAwesomeIcon icon={faSatelliteDish} size="1x" /> : <FontAwesomeIcon icon={faFolder} size="1x" />}
                <span style={{ color: "white" }}>{text}</span>
              </>
            )}
          </S.BadgeWrapper>
        </a>
      ),
      style: { backgroundColor: "#3e4146" },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
      style: { backgroundColor: "#3e4146" },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
      style: { backgroundColor: "#3e4146" },
    },
  ];

  const data = props.devices
    .filter((device) => device.location === props.value && device.email === email)
    .map((device) => {
      return {
        key: device.name,
        name: device.name,
        location: device.location,
        status: "Some Status",
      };
    });

  const selectedColumns = localThemeMode === "darkTheme" ? columnsDark : columns;

  return (
    <>
      <Table
        columns={selectedColumns}
        dataSource={data}
        pagination={false}
        components={{
          header: {
            cell: (props) => (
              <th {...props} style={{ background: "#1890ff", color: "white" }}>
                {props.children}
              </th>
            ),
          },
          body: {
            cell: (props) => (
              <td
                {...props}
                style={{
                  background: localThemeMode === "darkTheme" ? "black" : "#f8f9fd",
                  color: localThemeMode === "darkTheme" ? "white" : "black",
                }}
              >
                {props.children}
              </td>
            ),
          },
        }}
      />
    </>
  );
};

export default UbadgeTable;
