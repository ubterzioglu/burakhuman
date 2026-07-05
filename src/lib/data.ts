import { legacyCategories, legacyContentTypes, legacyFiles, legacyPages, TYPE_BLOG, TYPE_PAGE, TYPE_SLIDER } from "./legacy";
import { createSupabaseServiceClient, isSupabaseConfigured } from "./supabase";
import type { Category, ContentType, FileRecord, MessageRecord, PageRecord, RevisionRequest } from "./types";

const pageSelect =
  "id, sub_page_id, category_id, type_id, lang, title, summary, body, picture_url, rank, chck1, chck2, val1, val2, val3, val4, val5, val6, val7, published, created_at, updated_at";
const revisionSelect = "id, title, page_url, description, priority, status, admin_notes, created_at, updated_at";

function service() {
  return isSupabaseConfigured() ? createSupabaseServiceClient() : null;
}

export async function getContentTypes(): Promise<ContentType[]> {
  const supabase = service();
  if (!supabase) return legacyContentTypes;
  const { data, error } = await supabase.from("content_types").select("*").order("id");
  return error || !data ? legacyContentTypes : data;
}

export async function getCategories(typeId?: number): Promise<Category[]> {
  const supabase = service();
  if (!supabase) return legacyCategories.filter((category) => !typeId || category.type_id === typeId);
  let query = supabase.from("categories").select("*").order("rank").order("name");
  if (typeId) query = query.eq("type_id", typeId);
  const { data, error } = await query;
  return error || !data ? legacyCategories.filter((category) => !typeId || category.type_id === typeId) : data;
}

export async function getPages(options: {
  typeId?: number;
  lang?: string;
  limit?: number;
  publishedOnly?: boolean;
} = {}): Promise<PageRecord[]> {
  const { typeId, lang = "en", limit, publishedOnly = true } = options;
  const supabase = service();
  if (!supabase) {
    return legacyPages
      .filter((page) => (!typeId || page.type_id === typeId) && page.lang === lang && (!publishedOnly || page.published))
      .sort((a, b) => a.rank - b.rank)
      .slice(0, limit ?? legacyPages.length);
  }

  let query = supabase.from("pages").select(pageSelect).eq("lang", lang).order("rank");
  if (typeId) query = query.eq("type_id", typeId);
  if (publishedOnly) query = query.eq("published", true);
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return error || !data ? [] : data;
}

export async function getPageById(id: number, publishedOnly = true): Promise<PageRecord | null> {
  const supabase = service();
  if (!supabase) return legacyPages.find((page) => page.id === id && (!publishedOnly || page.published)) ?? null;
  let query = supabase.from("pages").select(pageSelect).eq("id", id);
  if (publishedOnly) query = query.eq("published", true);
  const { data, error } = await query.single();
  return error || !data ? null : data;
}

export async function getHomeData() {
  const [sliders, about, blogs, categories] = await Promise.all([
    getPages({ typeId: TYPE_SLIDER, limit: 4 }),
    getPageById(7),
    getPages({ typeId: TYPE_BLOG, limit: 8 }),
    getCategories(TYPE_BLOG),
  ]);

  return { sliders, about, blogs, categories };
}

export async function getBlogData() {
  const [blogs, categories] = await Promise.all([getPages({ typeId: TYPE_BLOG }), getCategories(TYPE_BLOG)]);
  return { blogs, categories };
}

export async function getContactPage() {
  return getPageById(6);
}

export async function getPageImages(pageId: number): Promise<FileRecord[]> {
  const supabase = service();
  if (!supabase) return legacyFiles.filter((file) => file.album_id === pageId && file.kind === "image").sort((a, b) => a.rank - b.rank);
  const { data, error } = await supabase
    .from("files")
    .select("id, album_id, kind, extension, title, file_url, rank, created_at")
    .eq("album_id", pageId)
    .eq("kind", "image")
    .order("rank");
  return error || !data ? [] : data;
}

export async function getAdminDashboardData() {
  const [types, categories, pages, messages, revisions] = await Promise.all([
    getContentTypes(),
    getCategories(),
    getPages({ publishedOnly: false, lang: "en" }),
    getMessages(),
    getRevisionRequests(),
  ]);
  return { types, categories, pages, messages, revisions };
}

export async function getMessages(): Promise<MessageRecord[]> {
  const supabase = service();
  if (!supabase) return [];
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  return error || !data ? [] : data;
}

export async function getRevisionRequests(): Promise<RevisionRequest[]> {
  const supabase = service();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("revision_requests")
    .select(revisionSelect)
    .order("created_at", { ascending: false });
  return error || !data ? [] : data;
}

export { TYPE_BLOG, TYPE_PAGE, TYPE_SLIDER };
