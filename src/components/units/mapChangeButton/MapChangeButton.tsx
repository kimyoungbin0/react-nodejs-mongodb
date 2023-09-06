import * as S from "./MapChangeButton.style";
import { Button, Drawer, Form, Input } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";

const MapChangeButton: React.FC<any> = (props) => {
  const [visible, setVisible] = useState(false);
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("file", file);

    const segments = props.value.split("/");
    const name = segments.pop();
    const location = segments.join("/");

    formData.append("location", location);
    formData.append("name", name);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data.fileName);
        props.setRefreshImage(!props.refreshImage); // 이미지 새로 고침 상태 변경
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
    }
  };

  const showDrawer = () => {
    form.setFieldsValue({
      location: props.value,
    });
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <S.PlusWrapper onClick={showDrawer}>
        <FontAwesomeIcon icon={faRetweet} size="xl" />
      </S.PlusWrapper>
      <Drawer title="Map 변경" placement="right" closable={false} onClose={onClose} open={visible}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="file" label="File Upload">
            <Input type="file" name="file" onChange={handleFileChange} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default MapChangeButton;
