import * as S from "./addButton.style";
import { Button, Drawer, Form, Input } from "antd";
import { Segmented } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Row, Col } from "antd";

const AddButton: React.FC<any> = (props) => {
  const [visible, setVisible] = useState(false);
  const [check, setCheck] = useState<string | number>("Folder");
  // useSession 훅을 사용해서 세션 정보를 가져옵니다.
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const onFinish = async (values) => {
    const { latitude, longitude, latitude_L, longitude_L, latitude_R, longitude_R, ...rest } = values;

    const data = {
      ...rest,
      latLong: { latitude, longitude },
      size: { latitude_L, longitude_L, latitude_R, longitude_R },
      email: email,
    };
    console.log("Data sent to server:", data);
    try {
      const response = await axios.post("/api/devices", data);
      if (response.status === 200) {
        console.log("Data successfully saved");
        await props.fetchData();
        form.resetFields();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data);
      }
    }
  };
  const [form] = Form.useForm();

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
      <S.PlusWrapper onClick={showDrawer}>+</S.PlusWrapper>
      <Drawer title="Folder&Sensor 추가" placement="right" closable={false} onClose={onClose} open={visible}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Segmented options={["Sensor", "Folder"]} value={check} onChange={setCheck} />
        </div>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Input name" />
          </Form.Item>
          {check !== "Sensor" && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="latitude_L" name="latitude_L">
                    <Input placeholder="Input latitude_L" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="longitude_L" name="longitude_L">
                    <Input placeholder="Input longitude_L" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="latitude_R" name="latitude_R">
                    <Input placeholder="Input latitude_R" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="longitude_R" name="longitude_R">
                    <Input placeholder="Input longitude_R" />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="latitude" name="latitude">
                <Input placeholder="Input latLong" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="longitude" name="longitude">
                <Input placeholder="Input longitude" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Location" name="location">
            <Input placeholder={props.value} />
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
export default AddButton;
