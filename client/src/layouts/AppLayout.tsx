import { ApiOutlined } from "@ant-design/icons";
import LogoImage from "@assets/logo.png";
import useAuth from "@hooks/useAuth";
import useGlobal from "@hooks/useGlobal";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Image,
  Layout,
  Space,
  Typography,
} from "antd";
import { DatabaseIcon, LogOutIcon, User2Icon } from "lucide-react";

import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const { Content, Header } = Layout;
const { Text } = Typography;

const AppLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { messageApi } = useGlobal();
  const { isAuthenticated, userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const showHeader = useMemo(() => {
    return isAuthenticated;
  }, [isAuthenticated]);

  return (
    <Layout>
      {showHeader && (
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 64,
            borderBottom: "1px solid #f0f0f0",
            padding: "0px 16px",
            gap: 16,
          }}
        >
          <Flex
            align="center"
            gap={16}
            style={{ width: "100%" }}
            justify="space-between"
          >
            <Link to={"/"}>
              <Image
                src={LogoImage}
                alt="Scrapy Logo"
                width={40}
                height={40}
                preview={false}
                style={{
                  borderRadius: 8,
                }}
              />
            </Link>
            <div className="desktop-menu">
              <Flex gap={16}>
                <Dropdown
                  placement="bottom"
                  menu={{
                    items: [
                      {
                        icon: <DatabaseIcon size={14} />,
                        key: "Data Store",
                        label: "Data Store",
                        onClick: () => {
                          navigate("/data");
                        },
                      },
                      {
                        icon: <ApiOutlined size={14} />,
                        key: "Get Token",
                        label: "Get Token",
                        onClick: async () => {
                          const token = localStorage.getItem("token");
                          if (token) {
                            await navigator.clipboard.writeText(token);
                            messageApi.success("Copied!");
                          }
                        },
                      },

                      {
                        key: "logout",
                        icon: <LogOutIcon size={14} />,
                        label: "Logout",
                        onClick: () => {
                          logout();
                        },
                      },
                    ],
                  }}
                >
                  <Button>
                    <Space>
                      <Avatar
                        size={18}
                        style={{
                          backgroundColor: "#f56a00",
                          cursor: "pointer",
                        }}
                        src={<User2Icon size={18} />}
                      />
                      <Text>{userInfo?.email}</Text>
                    </Space>
                  </Button>
                </Dropdown>
              </Flex>
            </div>
          </Flex>
        </Header>
      )}

      <Content
        style={{
          height: showHeader ? "calc(100vh - 64px)" : "100vh",
          overflow: "auto",
          position: "relative",
          backgroundColor: "#f7f7f7",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout;
