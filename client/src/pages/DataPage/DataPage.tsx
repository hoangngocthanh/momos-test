import { Button, Flex, Table } from "antd";
import React from "react";

import { getUserMediaApi } from "@apis/user-media";
import { useQuery } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import { UserMedia } from "src/types/user-media-types";
import MediaViewerModal from "./components/MediaViewerModal";

const DataPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { data: userMediaData, isLoading } = useQuery({
    queryKey: ["user-media", page, limit],
    queryFn: () => getUserMediaApi(page, limit),
  });

  const columns: ColumnsType<UserMedia> = [
    {
      title: "Type",
      dataIndex: "crawl_type",
      key: "crawl_type",
    },
    {
      title: "Input",
      dataIndex: "crawl_string",
      key: "crawl_string",
    },
    {
      title: "Data",
      dataIndex: "media",
      key: "media",
      render: (media: UserMedia["media"]) => `${media.length} media`,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (item) => (
        <Button
          onClick={() => {
            setSearchParams((prev) => {
              prev.append("userMediaId", item.id);
              return prev;
            });
          }}
        >
          Show Media
        </Button>
      ),
    },
  ];

  const onPageChange = (page: number, pageSize: number) => {
    setSearchParams({ page: page.toString(), limit: pageSize.toString() });
  };

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
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={userMediaData?.data ?? []}
        rowKey={(item) => item.id}
        pagination={{
          current: page,
          pageSize: limit,
          total: userMediaData?.total || 0,
          onChange: onPageChange,
          showSizeChanger: true,
          pageSizeOptions: ["1", "10", "20", "50"],
        }}
      />
      <MediaViewerModal />
    </Flex>
  );
};

export default DataPage;
