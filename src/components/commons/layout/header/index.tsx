import { AppstoreTwoTone, BellOutlined, LoginOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  /* background-color: skyblue; */
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  border-bottom: solid 1px #cccccc;
`;

const SiteWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 10px;
  line-height: 16px;
`;

const HomeWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 10px;
  line-height: 16px;
`;

const SpanLogo = styled.a`
  width: 200px;
  font-size: 1.5rem;
  font-weight: 900;

  text-decoration: none;
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding-right: 10px;
  line-height: 16px;
`;

const LoginItemWrapper = styled.div`
  padding-left: 10px;
`;

const IconWrapper = styled.div`
  svg {
    width: 40px;
    height: 40px;
  }
`;

export default function LayoutHeader() {
  return (
    <>
      <Wrapper>
        <HomeWrapper>
          <SiteWrapper>
            <IconWrapper>
              <AppstoreTwoTone />
            </IconWrapper>
            <LogoWrapper>
              <SpanLogo href="/"> FlexReal v0.0.1</SpanLogo>
              <span>support@rinasolution.com</span>
            </LogoWrapper>
          </SiteWrapper>
          <LoginWrapper>
            <LoginItemWrapper>
              <BellOutlined />
            </LoginItemWrapper>
            <LoginItemWrapper>
              <LoginOutlined />
            </LoginItemWrapper>
          </LoginWrapper>
        </HomeWrapper>
      </Wrapper>
    </>
  );
}
