import { Button, Flex, Result } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const NotfoundErrorPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Flex
      vertical
      style={{
        minHeight: 280,
        padding: 8,
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: 8,
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, there is something wrong, please try again."
        extra={
          <Button onClick={() => navigate("/")} type="primary">
            Back
          </Button>
        }
      />
    </Flex>
  );
};

export default NotfoundErrorPage;
