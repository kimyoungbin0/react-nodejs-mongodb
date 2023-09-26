import React, { useState, useEffect } from "react";
import { Form, Switch } from "antd";
import axios from "axios"; // axios 추가

export default function LoginPage() {
  const [isMapVisible, setMapVisible] = useState(false);

  const handleSwitchChange = async (checked: boolean) => {
    setMapVisible(checked);

    try {
      const response = await axios.post("/api/login", {
        email: "rina",
        theme: checked ? "dark" : "white",
      });

      if (response.data.success) {
        console.log("Theme updated successfully.");
      }
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  return (
    <>
      <div>다크모드</div>
      <Form layout="vertical">
        <Switch defaultChecked={false} onChange={handleSwitchChange} />
      </Form>
    </>
  );
}
