import { BulbOutlined } from "@ant-design/icons";
import LoadingAnimation from "@assets/loading-dots.json";
import { Flex, Space, Typography } from "antd";
import Lottie from "lottie-react";
import React from "react";
const { Text } = Typography;

const LoadingScreen: React.FC = () => {
  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{
        height: "100vh",
        backgroundColor: "#fff",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Lottie
        style={{ maxWidth: 120 }}
        animationData={LoadingAnimation}
        loop={true}
      />
      <Text strong>Getting ready...</Text>
      <Space>
        <BulbOutlined />
        <Text type="secondary">This is a media Scraper Service</Text>
      </Space>
    </Flex>
  );
};

export default LoadingScreen;
