import styled from "@emotion/styled";
import {
  ClusterOutlined,
  DashboardOutlined,
  DashboardTwoTone,
  LineChartOutlined,
  LogoutOutlined,
  MessageOutlined,
  ProjectOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Wrapper = styled.div`
  width: 201px;
  max-height: 100vh;
  padding: 10px;
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
`;

const MenuItemWrapper = styled.div`
  width: 100%;
  padding: 0;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MenuItem = styled.a`
  height: 40px;
  padding: 10px;
  font-size: 1.2rem;
  text-decoration: none;
`;

const MenuItemDeactivated = styled.a`
  height: 40px;
  padding: 10px;
  font-size: 1.2rem;
  color: lightgray;
  text-decoration: none;
`;

export default function Menu() {
  return (
    <>
      <Wrapper>
        <MenuWrapper>
          <MenuItemWrapper>
            <DashboardOutlined />
            <MenuItem href="/fftos2">DashBoard</MenuItem>
          </MenuItemWrapper>
          {/* <MenuItemWrapper>
            <LineChartOutlined />
            <MenuItem href="/daq">DAQ</MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <LineChartOutlined />
            <MenuItem href="/fftos">FFT OS</MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <LineChartOutlined />
            <MenuItem href="/fftos2">FFT OS2</MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <LineChartOutlined />
            <MenuItem href="/os">OS Wave</MenuItem>
          </MenuItemWrapper> */}
          <MenuItemWrapper>
            <ProjectOutlined />
            <MenuItemDeactivated>Transaction</MenuItemDeactivated>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <MessageOutlined />
            <MenuItemDeactivated>Message</MenuItemDeactivated>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <ClusterOutlined />
            <MenuItemDeactivated>Devices</MenuItemDeactivated>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <ProjectOutlined />
            <MenuItemDeactivated>Statistics</MenuItemDeactivated>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <UserOutlined />
            <MenuItemDeactivated>Account</MenuItemDeactivated>
          </MenuItemWrapper>
        </MenuWrapper>
        <MenuWrapper>
          <MenuItemWrapper>
            <SettingOutlined />
            <MenuItem>Setting</MenuItem>
          </MenuItemWrapper>
          <MenuItemWrapper>
            <LogoutOutlined />
            <MenuItem>Logout</MenuItem>
          </MenuItemWrapper>
        </MenuWrapper>
      </Wrapper>
    </>
  );
}
