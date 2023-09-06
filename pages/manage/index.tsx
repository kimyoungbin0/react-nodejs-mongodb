import React, { useState, useEffect } from "react";
import UbadgeManage from "../../src/components/units/ubadge_manage/UbadgeManage";
import AddButton from "../../src/components/units/addButton/addButton";
import axios from "axios"; // Add axios import
import MapChangeButton from "../../src/components/units/mapChangeButton/MapChangeButton";
import Map from "../../src/components/units/map/Map";
import ShowLocation from "../../src/components/units/showLocation/ShowLocation";

export default function ManagePage() {
  const [value, setValue] = useState<any>("All");
  const [isMapVisible, setMapVisible] = useState(false); // 상태 추가
  const [devices, setDevices] = useState([]); // Add this state for devices
  const [refreshImage, setRefreshImage] = useState(false);

  const handleSwitchChange = (checked: boolean) => {
    // Switch 변경 이벤트 핸들러
    setMapVisible(checked);
  };

  const fetchData = async () => {
    // Change this to a normal function (not inside useEffect) so we can call it from other components
    const response = await axios.get(`/api/devices?location=${value}`);
    setDevices(response.data);
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
    <>
      <div style={{ display: "flex", flexDirection: "row", height: "100%", width: "100%", padding: "30px" }}>
        <div style={{ flex: 1, position: "relative", width: "100%", height: "100%" }}>
          <div style={{ height: "4%", paddingBottom: "8px" }}>
            <ShowLocation value={value} setValue={setValue} handleSwitchChange={handleSwitchChange} />
          </div>
          <div style={{ height: "96%", paddingBottom: "8px" }}>
            <UbadgeManage value={value} setValue={setValue} isMapVisible={isMapVisible} setMapVisible={setMapVisible} devices={devices} fetchData={fetchData} />
          </div>
          <AddButton value={value} setValue={setValue} fetchData={fetchData} />
        </div>

        <div style={{ flex: 3, display: "flex", marginLeft: "20px", height: "100%" }}>
          <Map value={value} setValue={setValue} devices={devices} refreshImage={refreshImage} />
          {isMapVisible && (
            <MapChangeButton value={value} setValue={setValue} fetchData={fetchData} refreshImage={refreshImage} setRefreshImage={setRefreshImage} />
          )}
        </div>
      </div>
    </>
  );
}
