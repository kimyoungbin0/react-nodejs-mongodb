import React, { useState, useEffect } from "react";
import RecentActivity from "../../src/components/units/recentActivity/RecentActivity";
import axios from "axios";
import Ubadge from "../../src/components/units/ubadge/Ubadge";
import Map from "../../src/components/units/map/Map";
import Chart0 from "../../src/components/units/chart/Chart";
import { useSession } from "next-auth/react";
import ShowLocation from "../../src/components/units/showLocation/ShowLocation";

export default function Home() {
  const [value, setValue] = useState<any>("All");
  const [isMapVisible, setMapVisible] = useState(false);
  const [devices, setDevices] = useState([]);

  const handleSwitchChange = (checked: boolean) => {
    setMapVisible(checked);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/devices?location=${value}`);
      setDevices(response.data);
    };

    fetchData();
  }, [value]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      window.location.href = "/mobile";
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "93%", margin: "30px" }}>
      {/* 첫 번째 줄 */}
      <div style={{ display: "flex", width: "100%", height: "75%", marginBottom: "10px" }}>
        <div style={{ paddingRight: "20px", width: "65%", height: "100%" }}>
          <div style={{ height: "6%", paddingBottom: "8px" }}>
            <ShowLocation value={value} setValue={setValue} handleSwitchChange={handleSwitchChange} />
          </div>
          <div style={{ height: "94%" }}>
            <Map value={value} setValue={setValue} devices={devices} />
          </div>
        </div>
        <div style={{ paddingRight: "20px", width: "35%", height: "100%" }}>
          <RecentActivity value={value} setValue={setValue} />
        </div>
      </div>
      {/* 두 번째 줄 */}
      <div style={{ display: "flex", width: "100%", height: "25%" }}>
        <div style={{ paddingRight: "20px", width: "65%", height: "100%" }}>
          <Ubadge value={value} setValue={setValue} isMapVisible={isMapVisible} setMapVisible={setMapVisible} devices={devices} />
        </div>
        <div style={{ paddingRight: "20px", width: "35%", height: "100%" }}>
          <Chart0 />
        </div>
      </div>
    </div>
  );
}
