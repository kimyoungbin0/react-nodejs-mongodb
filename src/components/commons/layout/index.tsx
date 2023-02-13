import { useRouter } from "next/router";
import LayoutBanner from "./banner";
import LayoutFooter from "./footer";
import LayoutHeader from "./header";
import LayoutNavigation from "./navigation";

const HIDDEN_HEADERS = [
  "/12-02-library-star",
  "/12-04-modal-custom",
  // ...
  // ...
  // ...
];

interface ILayoutProps {
  children: JSX.Element;
}
export default function Layout(props: ILayoutProps) {
  const router = useRouter();
  console.log("======");
  console.log(router.asPath);
  console.log("======");

  const isHiddenHeader = HIDDEN_HEADERS.includes(router.asPath);

  return (
    <>
      {!isHiddenHeader && <LayoutHeader />}
      <LayoutBanner />
      <LayoutNavigation />
      <div style={{ height: "800px", display: "flex" }}>
        <div
          style={{
            width: "201px",
            padding: "10px",
            backgroundColor: "white",
            borderRight: "solid 1px #cccccc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ height: "40px", padding: "10px" }}>DashBoard</div>
          <div style={{ height: "40px", padding: "10px" }}>Transaction</div>
          <div style={{ height: "40px", padding: "10px" }}>Message</div>
          <div style={{ height: "40px", padding: "10px" }}>Devices</div>
          <div style={{ height: "40px", padding: "10px" }}>Statistic</div>
          <div style={{ height: "40px", padding: "10px" }}>Account</div>
        </div>
        <div style={{ width: "calc(100% - 201px)", padding: "10px" }}>
          {props.children}
        </div>
      </div>
      <LayoutFooter />
    </>
  );
}
