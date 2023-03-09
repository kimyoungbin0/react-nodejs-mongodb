import styled from "@emotion/styled";

const Wrapper = styled.div`
  width: 201px;
  padding: 10px;
  background-color: white;
  border-right: solid 1px #cccccc;
  display: flex;
  flex-direction: column;
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
        <MenuItem href="/daq">DAQ</MenuItem>
        <MenuItem href="/fftos">FFT OS</MenuItem>
        <MenuItem href="/os">OS Wave</MenuItem>
        {/* <MenuItem href="/fft">OS FFT</MenuItem> */}
        <MenuItemDeactivated>Transaction</MenuItemDeactivated>
        <MenuItemDeactivated>Message</MenuItemDeactivated>
        <MenuItemDeactivated>Devices</MenuItemDeactivated>
        <MenuItemDeactivated>Statistic</MenuItemDeactivated>
        <MenuItemDeactivated>Account</MenuItemDeactivated>
      </Wrapper>
    </>
  );
}
