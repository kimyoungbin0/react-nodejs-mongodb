import React, { useState, useEffect } from "react";
import axios from "axios"; // Add axios import

import UbadgeTable from "../../src/components/units/ubadge_table/UbadgeTable";
import ShowLocation from "../../src/components/units/showLocation/ShowLocation";

export default function DevicesPage() {
  const [value, setValue] = useState<any>("All");
  const [isMapVisible, setMapVisible] = useState(false); // 상태 추가
  const [devices, setDevices] = useState([]); // Add this state for devices

  const handleSwitchChange = (checked: boolean) => {
    // Switch 변경 이벤트 핸들러
    setMapVisible(checked);
  };

  useEffect(() => {
    // Add this useEffect to fetch data when the component is mounted
    const fetchData = async () => {
      const response = await axios.get(`/api/devices?location=${value}`);
      setDevices(response.data);
    };

    fetchData();
  }, [value]); // Add the dependencies here

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "98%", height: "100%", padding: "30px" }}>
      <div style={{ height: "3%", marginRight: "10px" }}>
        <ShowLocation value={value} setValue={setValue} handleSwitchChange={handleSwitchChange} />
      </div>
      <div style={{ height: "97%", marginTop: "20px", marginLeft: "10px" }}>
        <UbadgeTable value={value} setValue={setValue} isMapVisible={isMapVisible} setMapVisible={setMapVisible} devices={devices} />
      </div>
    </div>
  );
}
