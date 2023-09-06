import React, { useState, useEffect } from "react";
import { Form, Switch } from "antd";
import axios from "axios"; // axios 추가

export default function LoginPage() {
  const [isMapVisible, setMapVisible] = useState(false);

  const handleSwitchChange = async (checked: boolean) => {
    setMapVisible(checked);

    try {
      // API 엔드포인트 URL을 적절하게 수정해주세요.
      const response = await axios.post("/api/login", {
        email: "rina", // 해당 사용자의 이메일
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
