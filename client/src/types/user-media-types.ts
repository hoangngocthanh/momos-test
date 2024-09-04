enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}

export interface Media {
  id: string;
  type: MediaType;
  url: string;
  user_media_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export type UserMedia = {
  crawl_string: string;
  crawl_type: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  id: string;
  media: Media[];
  user_id: string;
};
