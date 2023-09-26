import React, { useState, useEffect } from "react";
import RecentActivity from "../../src/components/units/recentActivity/RecentActivity";
import axios from "axios";
import { Switch } from "antd";
import UbadgeTable from "../../src/components/units/ubadge_table/UbadgeTable";
import ShowLocation from "../../src/components/units/showLocation/ShowLocation";

export default function DevicesPage() {
  const [value, setValue] = useState<any>("All");
  const [isRecentlyVisible, setRecentlyVisible] = useState(false);
  const [devices, setDevices] = useState([]);

  const handleSwitchChange = (checked: boolean) => {
    setRecentlyVisible(checked);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/devices?location=${value}`);
      setDevices(response.data);
    };

    fetchData();
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <div style={{ display: "flex", height: "5%", width: "100%" }}>
        <div style={{ flex: "6", marginRight: "15px" }}>
          <ShowLocation value={value} setValue={setValue} handleSwitchChange={handleSwitchChange} />
        </div>
        <div style={{ flex: "1" }}>
          <Switch defaultChecked={false} onChange={handleSwitchChange} />
        </div>
      </div>
      <div style={{ height: "95%", width: "100%", marginTop: "10px" }}>
        {isRecentlyVisible ? (
          <RecentActivity value={value} setValue={setValue} />
        ) : (
          <UbadgeTable value={value} setValue={setValue} isMapVisible={isRecentlyVisible} setMapVisible={setRecentlyVisible} devices={devices} />
        )}
      </div>
    </div>
  );
}
