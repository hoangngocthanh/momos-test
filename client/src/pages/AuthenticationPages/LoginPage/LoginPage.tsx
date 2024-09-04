import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { loginByEmailApi } from "@apis/authentications";

import LogoImage from "@assets/logo.png";
import useAuth from "@hooks/useAuth";
import useGlobal from "@hooks/useGlobal";
import { useMutation } from "@tanstack/react-query";

import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  Space,
  Typography,
  theme,
} from "antd";
import { FC } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoginFormValues } from "src/types";
import { CustomResponse } from "src/utils";

const { Item: FormItem } = Form;
const { Text } = Typography;

const LoginPage: FC = () => {
  const { messageApi } = useGlobal();
  const { isAuthenticated, synchronizeLoginData } = useAuth();
  const navigate = useNavigate();
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const { mutate: loginByEmailMutate, isPending: loginPending } = useMutation({
    mutationFn: (data: LoginFormValues) =>
      loginByEmailApi(data.email, data.password),
    onSuccess: async (
      response: CustomResponse<{
        access_token: string;
      }>
    ) => {
      synchronizeLoginData({
        access_token: response.data.access_token,
        callback: () => {
          messageApi.success("Login successfully!");
          navigate("/");
        },
      });
    },
    onError: (error) => {
      messageApi.error(error.message ?? "Login Failed!");
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Flex style={{ height: "100vh" }} justify="center" align="center">
      <Flex vertical gap={16} style={{ maxWidth: 500, width: "100%" }}>
        <Flex gap={8}>
          <Image
            src={LogoImage}
            alt="Scrapy"
            width={40}
            height={40}
            style={{
              borderRadius: 8,
            }}
            preview={false}
          />
          <Flex vertical>
            <Space size={2}>
              <Text strong>Scrapy</Text>
              <Text style={{ color: colorPrimary }}>Bot</Text>
            </Space>
            <Text style={{ fontSize: 10 }}>Media Scraper Service</Text>
          </Flex>
        </Flex>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={loginByEmailMutate}
        >
          <FormItem
            name="email"
            rules={[
              { type: "email", message: "The input is not valid email!" },
              { required: true, message: "Please input your email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="email" />
          </FormItem>
          <FormItem
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </FormItem>

          <FormItem>
            <Flex vertical gap={32}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loginPending}
              >
                Login
              </Button>
            </Flex>
          </FormItem>
          <Flex justify="center" gap={8}>
            <Text>Don&apos;t have an account?</Text>
            <Link to="/register">Create new</Link>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
