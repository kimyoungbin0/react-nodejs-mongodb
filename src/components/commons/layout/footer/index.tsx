import styled from "@emotion/styled";

const Wrapper = styled.div`
  height: 50px;
  width: 100vw;
  background-color: gray;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const A = styled.a`
  text-decoration: none;
  color: black;
`;

export default function LayoutFooter() {
  return (
    <Wrapper>
      <A href="https://rinasolution.com" target={"_blank"}>
        Copyright © 2022 Rina Solution Corp. All rights reserved.
      </A>
    </Wrapper>
  );
}
