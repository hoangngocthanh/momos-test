import requestHandler from "@configs/axios-client";

export const getUserMediaApi = (page: number, limit: number) => {
  return requestHandler({
    url: `/user-media`,
    method: "GET",
    params: {
      page,
      limit,
    },
  });
};

export const getMediaApi = (userMediaId: string) => {
  return requestHandler({
    url: `/media`,
    method: "GET",
    params: {
      userMediaId,
    },
  });
};
