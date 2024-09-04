import LogoImage from "@assets/logo.png";
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
import { BotIcon } from "lucide-react";
import React from "react";

import Icon from "@ant-design/icons";
import { scrapeByKeywordApi } from "@apis/scrapers";
import useGlobal from "@hooks/useGlobal";
import { useMutation } from "@tanstack/react-query";
import { CustomResponse } from "src/utils";

const { Text } = Typography;

type ScrapeByKeywordValues = {
  keyword: string;
};

const HomePage: React.FC = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { messageApi } = useGlobal();
  const { mutate: scrapeMutate, isPending: scraping } = useMutation({
    mutationFn: (data: ScrapeByKeywordValues) =>
      scrapeByKeywordApi(data.keyword),
    onSuccess: async (
      response: CustomResponse<{
        success: boolean;
      }>
    ) => {
      console.log(response);
    },
    onError: () => {
      messageApi.error("Scrape Failed!");
    },
  });

  return (
    <Flex
      vertical
      style={{
        minHeight: 280,
        padding: 8,
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      <Flex
        vertical
        justify="center"
        align="center"
        style={{ height: "100%" }}
        gap={16}
        flex={1}
      >
        <Flex gap={8} style={{ padding: 8, borderRadius: 8 }}>
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
          <Flex vertical>
            <Space size={2}>
              <Text strong style={{ fontSize: 18 }}>
                Scrapy
              </Text>
              <Text
                style={{ color: colorPrimary, fontSize: 18, fontWeight: 700 }}
              >
                Bot
              </Text>
            </Space>
            <Text style={{ fontSize: 10 }}>Media Scraper Service</Text>
          </Flex>
        </Flex>
        <Form<ScrapeByKeywordValues>
          style={{
            width: "100%",
            maxWidth: 500,
          }}
          onFinish={scrapeMutate}
        >
          <Form.Item<ScrapeByKeywordValues> name="keyword">
            <Input placeholder="Enter you keyword to scrape" />
          </Form.Item>
          <Flex justify="center">
            <Button
              loading={scraping}
              icon={<Icon component={() => <BotIcon size={14} />} />}
              type="primary"
              htmlType="submit"
            >
              Scrape now
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Flex>
  );
};

export default HomePage;
