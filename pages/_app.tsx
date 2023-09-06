// import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../src/components/commons/layout";
import { Global } from "@emotion/react";
import { globalStyles } from "../src/commons/styles/globalStyles";
import { ConfigProvider } from "antd";
import koKR from "antd/lib/locale/ko_KR";
import React from "react";
import { SessionProvider } from "next-auth/react";
import ApolloSetting from "../src/components/commons/apollo";
export default function App({ Component, pageProps }: AppProps) {
  if (!process.browser) React.useLayoutEffect = React.useEffect;
  return (
    <ApolloSetting>
      <SessionProvider>
        <ConfigProvider locale={koKR}>
          <Global styles={globalStyles} />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ConfigProvider>
      </SessionProvider>
    </ApolloSetting>
  );
}
