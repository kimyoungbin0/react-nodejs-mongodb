import styled from "@emotion/styled";

const Wrapper = styled.div`
  height: 50px;
  background-color: skyblue;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
`;

const SpanLogo = styled.span`
  width: 200px;
  font-size: 1.5rem;
  font-weight: 900;
`;

export default function LayoutHeader() {
  return (
    <Wrapper>
      <SpanLogo>FlexReal v0.0.1</SpanLogo>
    </Wrapper>
  );
}
