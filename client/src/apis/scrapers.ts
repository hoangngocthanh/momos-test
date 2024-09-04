import requestHandler from "@configs/axios-client";

export const scrapeByKeywordApi = (keyword: string) => {
  return requestHandler({
    url: "/scraper/keyword",
    method: "POST",
    data: {
      keyword,
    },
  });
};

export const scrapeByKUrlsApi = (urls: []) => {
  return requestHandler({
    url: "/scraper/urls",
    method: "POST",
    data: {
      urls,
    },
  });
};
