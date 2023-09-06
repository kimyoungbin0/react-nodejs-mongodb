import React, { useEffect, useState } from "react";
import { Avatar, Badge, Space, Button, Drawer, Form, Input, Row, Col } from "antd";
import * as S from "./UbadgeManage.styles";
import axios from "axios"; // 필요한 경우 적절한 경로로 수정해야 합니다.
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faSatelliteDish } from "@fortawesome/free-solid-svg-icons";

const UbadgeManage: React.FC<any> = (props) => {
  const [visible, setVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const onClickBadgeButton = async (item, preValue, setValue) => {
    if (props.isMapVisible === true) {
      try {
        const response = await axios.get(`/api/devices?location=${item.location}&name=${item.name}&email=${email}`);
        const deviceData = response.data[0];
        console.log("Response data:", deviceData.latLong.latitude);
        if (deviceData) {
          setSelectedDevice(deviceData);
          form.setFieldsValue({
            latitude_L: deviceData.size.latitude_L,
            longitude_L: deviceData.size.longitude_L,
            latitude_R: deviceData.size.latitude_R,
            longitude_R: deviceData.size.longitude_R,
            latitude: deviceData.latLong.latitude,
            longitude: deviceData.latLong.longitude,
            location: deviceData.location,
            name: deviceData.name,
          });
        }
      } catch (error) {
        console.error("device 데이터를 가져오는 중 에러:", error);
      }
      console.log("성공");
      showDrawer();
    } else {
      if (item.name.includes("#")) {
        window.location.href = "/fft";
      } else {
        setValue(preValue + "/" + item.name);
      }
    }
  };

  useEffect(() => {
    form.setFieldsValue({ location: props.value });
  }, [props.value, form]);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const onFinish = async (values) => {
    try {
      // 원래의 name과 location 값을 originalName과 originalLocation으로 보내기
      const response = await axios.put(`/api/devices`, {
        ...values,
        originalName: selectedDevice.name,
        originalLocation: selectedDevice.location,
      });

      if (response.status === 200) {
        console.log("Update successful!");
        await props.fetchData(); // Update 후 데이터 다시 가져오기
        form.resetFields();
        onClose();
      } else {
        console.error("Failed to update:", response.data);
      }
    } catch (error) {
      console.error("Error updating device data:", error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await axios.delete(`/api/devices`, {
        data: {
          location: selectedDevice.location,
          name: selectedDevice.name,
        },
      });

      if (response.status === 200) {
        console.log("Deletion successful!");
        await props.fetchData();
        form.resetFields();
        onClose();
      } else {
        console.error("Failed to delete:", response.data);
      }
    } catch (error) {
      console.error("Error deleting device data:", error);
    }
  };

  return (
    <>
      <S.StyledSpace>
        {props.devices &&
          props.devices
            .filter((device) => device.location === props.value && device.email === email)
            .map((device, index) => (
              <S.BadgeWrapper key={index}>
                {props.isMapVisible ? (
                  <>
                    <a key={index} onClick={() => onClickBadgeButton(device, props.value, props.setValue)}>
                      {device.name.includes("#") ? (
                        <FontAwesomeIcon icon={faSatelliteDish} size="3x" style={{ color: "#e00b0b" }} />
                      ) : (
                        <FontAwesomeIcon icon={faFolder} size="3x" />
                      )}
                    </a>
                    <span>{device.name}</span>
                  </>
                ) : (
                  <>
                    <a key={index} onClick={() => onClickBadgeButton(device, props.value, props.setValue)}>
                      {device.name.includes("#") ? (
                        <FontAwesomeIcon icon={faSatelliteDish} size="3x" style={{ color: "#e00b0b" }} />
                      ) : (
                        <FontAwesomeIcon icon={faFolder} size="3x" />
                      )}
                    </a>
                    <S.DeviceName>{device.name}</S.DeviceName>
                  </>
                )}
              </S.BadgeWrapper>
            ))}
      </S.StyledSpace>

      <Drawer title="Folder&Sensor 수정" placement="right" closable={false} onClose={onClose} open={visible}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}></div>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Input name" />
          </Form.Item>

          {!selectedDevice?.name.includes("#") && (
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
                <Input placeholder="Input latitude" />
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
          <Form.Item>
            <Button type="primary" danger onClick={onDelete}>
              delete
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default UbadgeManage;
