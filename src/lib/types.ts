export type ContentType = {
  id: number;
  name: string;
  title_label: string | null;
  summary_label: string | null;
  text_label: string | null;
  has_picture: boolean;
  has_categories: boolean;
  has_tags: boolean;
  has_sub_images: boolean;
  has_sub_files: boolean;
  is_protected: boolean;
};

export type Category = {
  id: number;
  type_id: number;
  name: string;
  rank: number;
};

export type PageRecord = {
  id: number;
  sub_page_id: number | null;
  category_id: number | null;
  type_id: number;
  lang: string;
  title: string;
  summary: string | null;
  body: string | null;
  picture_url: string | null;
  rank: number;
  chck1: boolean;
  chck2: boolean;
  val1: string | null;
  val2: string | null;
  val3: string | null;
  val4: string | null;
  val5: string | null;
  val6: string | null;
  val7: string | null;
  published: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type FileRecord = {
  id: number;
  album_id: number;
  kind: "image" | "file";
  extension: string | null;
  title: string | null;
  file_url: string;
  rank: number;
  created_at: string | null;
};

export type MessageRecord = {
  id: number;
  name: string;
  telephone: string | null;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "archived";
  created_at: string | null;
};

export type RevisionRequest = {
  id: number;
  title: string;
  page_url: string | null;
  description: string;
  priority: "low" | "normal" | "high";
  status: "new" | "in_progress" | "done" | "rejected";
  admin_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};
