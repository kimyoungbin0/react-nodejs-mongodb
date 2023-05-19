import styled from "@emotion/styled";
import {
  ClusterOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MessageOutlined,
  ProjectOutlined,
  SettingOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ApiOutlined,
} from "@ant-design/icons";

import { Menu, Button, MenuProps } from "antd";
import { useRef, useState } from "react";

const Wrapper = styled.div`
  /* width: 201px; */
  max-height: 100vh;
  /* padding: 10px; */
  background-color: white;
  border-right: solid 1px #cccccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow-y: auto;
`;

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MenuItemWrapper = styled.div`
  width: 100%;
  padding: 0;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default function MenuLeft() {
  const [collapsed, setCollapsed] = useState(false);
  const menuButtonRef = useRef(null);
  const leftTopMenuRef = useRef(null);
  const leftBottomMenuRef = useRef(null);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  type MenuItems = Required<MenuProps>["items"][number];

  function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItems[], type?: "group"): MenuItems {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItems;
  }

  // const onClick: MenuProps["onClick"] = (e) => {
  //   console.log("click ", e);
  // };

  const items: MenuProps["items"] = [
    { type: "divider" },
    getItem("DashBoard", "sub1", <DashboardOutlined />, [
      getItem(<a href="/fftos2">FFT OS</a>, "1"),
      getItem(<a href="/daq">Wave Form</a>, "2"),
      getItem(<a href="/wfft">Wave Form to FFT</a>, "3"),
    ]),
    { type: "divider" },
    getItem("Transaction", "sub2", <ApiOutlined />),
    { type: "divider" },
    getItem("Message", "sub3", <MessageOutlined />),
    { type: "divider" },
    getItem("Devices", "sub4", <ClusterOutlined />),
    { type: "divider" },
    getItem("Statistics", "sub5", <ProjectOutlined />),
    { type: "divider" },
    getItem("Account", "sub6", <UserOutlined />),
    { type: "divider" },
  ];

  const items2: MenuProps["items"] = [
    { type: "divider" },
    getItem("Setting", "sub1", <SettingOutlined />),
    { type: "divider" },
    getItem("Logout", "sub2", <LogoutOutlined />),
    { type: "divider" },
  ];

  return (
    <>
      <Wrapper style={{ minWidth: collapsed ? 81 : 201, transition: "all 0.2s" }}>
        <MenuWrapper>
          {/* // TODO findDOMNode is deprecated in StrictMode. 관련 문제 해결 필요 */}
          <Button type="primary" onClick={toggleCollapsed} style={{ marginTop: 10, marginLeft: 10, marginRight: 10, marginBottom: 10 }} ref={menuButtonRef}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Menu defaultSelectedKeys={["1"]} defaultOpenKeys={["sub1"]} mode="inline" inlineCollapsed={collapsed} items={items} ref={leftTopMenuRef} />
        </MenuWrapper>
        <MenuWrapper>
          <Menu defaultSelectedKeys={[]} defaultOpenKeys={[]} mode="inline" inlineCollapsed={collapsed} items={items2} ref={leftBottomMenuRef} />
        </MenuWrapper>
      </Wrapper>
    </>
  );
}
