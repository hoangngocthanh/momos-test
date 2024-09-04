import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { signUpByEmailApi } from "@apis/index";
import LogoImage from "@assets/logo.png";
import useAuth from "@hooks/useAuth";
import useGlobal from "@hooks/useGlobal";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Form, Image, Input, Space, Typography } from "antd";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomResponse } from "src/utils";

const { Item: FormItem } = Form;

const { Text } = Typography;

type SignUpFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage: FC = () => {
  const { messageApi } = useGlobal();
  const { synchronizeLoginData } = useAuth();
  const navigate = useNavigate();

  const { mutate: signUpByEmailMutate, isPending: signUpPending } = useMutation(
    {
      mutationFn: (data: SignUpFormValues) =>
        signUpByEmailApi(data.email, data.password),
      onSuccess: async (
        response: CustomResponse<{
          access_token: string;
        }>
      ) => {
        navigate("/");
        synchronizeLoginData({
          access_token: response.data.access_token,
          callback: () => {
            messageApi.success("SignUp successfully!");
            navigate("/");
          },
        });
      },
      onError: (error) => {
        messageApi.error(error?.message ?? "SignUp Failed!");
      },
    }
  );

  return (
    <Flex style={{ height: "100vh" }} justify="center" align="center">
      <Flex vertical gap={16} style={{ width: "100%", maxWidth: 500 }}>
        <Flex gap={8}>
          <Image
            src={LogoImage}
            alt="Scrapy"
            width={40}
            height={40}
            style={{
              borderRadius: 8,
            }}
          />
          <Flex vertical>
            <Space size={2}>
              <Text strong>Scrapy</Text>
              <Text>Bot</Text>
            </Space>
            <Text style={{ fontSize: 10 }}>Media Scraper Service</Text>
          </Flex>
        </Flex>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={signUpByEmailMutate}
        >
          <FormItem<SignUpFormValues>
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="email" />
          </FormItem>
          <FormItem<SignUpFormValues>
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              {
                validator: (_rule, value) => {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (
                    !value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/) &&
                    value.length >= 8
                  ) {
                    return Promise.reject(
                      "Password must contain at least one number, one uppercase and one lowercase letter"
                    );
                  }
                  return Promise.resolve();
                },
                message:
                  "Password must contain at least one number, one uppercase and one lowercase letter",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </FormItem>
          <FormItem<SignUpFormValues>
            name="confirmPassword"
            rules={[
              { required: true, message: "Please input your Password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
            />
          </FormItem>

          <FormItem<SignUpFormValues>>
            <Flex vertical gap={32}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{
                  flex: 1,
                }}
                loading={signUpPending}
              >
                Create
              </Button>
              <Flex justify="center" gap={8}>
                <Text>Already have an account?</Text>
                <Link to="/login">Login now</Link>
              </Flex>
            </Flex>
          </FormItem>
        </Form>
      </Flex>
    </Flex>
  );
};

export default RegisterPage;
