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

export default function Menu() {
  return (
    <>
      <Wrapper>
        <MenuItem href="/daq">DAQ</MenuItem>
        <MenuItem href="os">OS Wave</MenuItem>
        <MenuItem href="fft">OS FFT</MenuItem>
        <MenuItem>Transaction</MenuItem>
        <MenuItem>Message</MenuItem>
        <MenuItem>Devices</MenuItem>
        <MenuItem>Statistic</MenuItem>
        <MenuItem>Account</MenuItem>
      </Wrapper>
    </>
  );
}
