import { useRouter } from "next/router";
import LayoutBanner from "./banner";
import LayoutFooter from "./footer";
import LayoutHeader from "./header";
import LayoutNavigation from "./navigation";
import MenuLeft from "./navigation/menu";

const HIDDEN_HEADERS = ["/xxx"];
const HIDDEN_BANNERS = ["/", "/daq", "/os", "/fft", "/fftos", "/fftos2", "/wfft", "dashboard"];
const HIDDEN_MENUS = ["/", "/daq", "/os", "/fft", "/fftos", "/fftos2", "/wfft", "dashboard"];
const HIDDEN_FOOTERS = ["xxx"];

interface ILayoutProps {
  children: JSX.Element;
}
export default function Layout(props: ILayoutProps) {
  const router = useRouter();
  console.log("======");
  console.log(router.asPath);
  console.log("======");

  const isHiddenHeader = HIDDEN_HEADERS.includes(router.asPath);
  const isHiddenBanner = HIDDEN_BANNERS.includes(router.asPath);
  const isHiddenMenu = HIDDEN_MENUS.includes(router.asPath);
  const isHiddenFooter = HIDDEN_FOOTERS.includes(router.asPath);

  const layoutHeight = (!isHiddenHeader ? 60 : 0) + (!isHiddenBanner ? 100 : 0) + (!isHiddenMenu ? 50 : 0) + (!isHiddenFooter ? 50 : 0);

  return (
    <>
      {!isHiddenHeader && <LayoutHeader />}
      {!isHiddenBanner && <LayoutBanner />}
      {!isHiddenMenu && <LayoutNavigation />}
      <div style={{ height: `calc(100vh - ${layoutHeight}px)`, display: "flex" }}>
        <MenuLeft />
        <div
          style={{
            minWidth: "calc(100% - 201px)",
            maxWidth: "calc(100% - 81px)",
            padding: "10px",
            overflow: "auto",
          }}
        >
          {props.children}
        </div>
      </div>
      {!isHiddenFooter && <LayoutFooter />}
    </>
  );
}
