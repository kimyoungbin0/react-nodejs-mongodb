import React, { useState, useEffect } from "react";
import { Avatar, Badge } from "antd";
import RecentActivity from "../../src/components/units/recentActivity/RecentActivity";
import { wrap } from "module";
import ChangeButton from "../../src/components/units/changeButton/ChangeButton";
import UbadgeManage from "../../src/components/units/ubadge_manage/UbadgeManage";
import StreeManage from "../../src/components/units/treeSelect_manage/TreeSelect";
import axios from "axios";
import Ubadge from "../../src/components/units/ubadge/Ubadge";
import Map from "../../src/components/units/map/Map";
import Ubadge2 from "../../src/components/units/ubadge_table/UbadgeTable";
import { Switch } from "antd";
import UbadgeTable from "../../src/components/units/ubadge_table/UbadgeTable";

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
      <div style={{ display: "flex" }}>
        <div style={{ flex: "6", marginRight: "15px" }}>
          <StreeManage value={value} setValue={setValue} handleSwitchChange={handleSwitchChange} />
        </div>
        <div style={{ flex: "1", marginTop: "15px" }}>
          <Switch defaultChecked={false} onChange={handleSwitchChange} />
        </div>
      </div>
      {isRecentlyVisible ? (
        <RecentActivity value={value} setValue={setValue} />
      ) : (
        <UbadgeTable value={value} setValue={setValue} isMapVisible={isRecentlyVisible} setMapVisible={setRecentlyVisible} devices={devices} />
      )}
    </div>
  );
}
