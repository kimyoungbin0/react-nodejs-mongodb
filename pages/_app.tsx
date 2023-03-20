// import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../src/components/commons/layout";
import { Global } from "@emotion/react";
import { globalStyles } from "../src/commons/styles/globalStyles";
import { ConfigProvider } from "antd";
import koKR from "antd/lib/locale/ko_KR";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ConfigProvider locale={koKR}>
        <Global styles={globalStyles} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
    </>
  );
}
