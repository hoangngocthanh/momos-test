import { Image, Modal } from "antd";
import React from "react";

import { getMediaApi } from "@apis/user-media";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Media } from "src/types/user-media-types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/virtual";
import { Navigation, Pagination, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const MediaViewerModal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userMediaId = searchParams.get("userMediaId");

  const { data: mediaData } = useQuery({
    queryKey: ["media", userMediaId],
    queryFn: () => (userMediaId ? getMediaApi(userMediaId) : skipToken),
  });

  return (
    <Modal
      width={"100vw"}
      styles={{
        body: {
          height: "70vh",
        },
      }}
      open={userMediaId != null}
      footer={null}
      centered
      onCancel={() =>
        setSearchParams((prev) => {
          prev.delete("userMediaId");
          return prev;
        })
      }
      title="Media Data"
    >
      <Swiper
        slidesPerView={1}
        centeredSlides={true}
        pagination={{
          type: "fraction",
        }}
        navigation={true}
        virtual
        modules={[Navigation, Pagination, Virtual]}
      >
        {(mediaData?.data ?? []).map((item: Media, index: number) => (
          <SwiperSlide key={item.id} virtualIndex={index}>
            {item.type === "image" ? (
              <Image preview={false} src={item.url} />
            ) : (
              <video src={item.url} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Modal>
  );
};

export default MediaViewerModal;
