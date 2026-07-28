import { legacyCategories, legacyContentTypes, legacyFiles, legacyPages, TYPE_BLOG, TYPE_PAGE, TYPE_SLIDER } from "./legacy";
import { isPostgresConfigured, query as dbQuery } from "./db";
import { createSupabaseServiceClient, isSupabaseConfigured } from "./supabase";
import type {
  BankAccount,
  Category,
  ContentType,
  FileRecord,
  Member,
  MessageRecord,
  Order,
  PageRecord,
  Product,
  ProductAsset,
  ProductAssetKind,
  RevisionComment,
  RevisionRequest,
  SiteOptionRecord,
} from "./types";

const pageSelect =
  "id, sub_page_id, category_id, type_id, lang, title, summary, body, picture_url, rank, chck1, chck2, val1, val2, val3, val4, val5, val6, val7, published, created_at, updated_at";
const revisionSelect = "id, title, page_url, description, priority, status, admin_notes, created_at, updated_at";
const revisionCommentSelect = "id, revision_id, body, created_at";

function service() {
  return isSupabaseConfigured() ? createSupabaseServiceClient() : null;
}

export async function getContentTypes(): Promise<ContentType[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<ContentType>("select * from content_types order by id");
        return rows;
      } catch {
        return legacyContentTypes;
      }
    }
    return legacyContentTypes;
  }
  const { data, error } = await supabase.from("content_types").select("*").order("id");
  return error || !data ? legacyContentTypes : data;
}

export async function getCategories(typeId?: number): Promise<Category[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const values = typeId ? [typeId] : [];
        const where = typeId ? "where type_id = $1" : "";
        const { rows } = await dbQuery<Category>(`select id, type_id, name, rank from categories ${where} order by rank, name`, values);
        return rows;
      } catch {
        return legacyCategories.filter((category) => !typeId || category.type_id === typeId);
      }
    }
    return legacyCategories.filter((category) => !typeId || category.type_id === typeId);
  }
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
    if (isPostgresConfigured()) {
      try {
        const values: unknown[] = [lang];
        const filters = ["lang = $1"];
        if (typeId) {
          values.push(typeId);
          filters.push(`type_id = $${values.length}`);
        }
        if (publishedOnly) filters.push("published = true");
        const limitClause = limit ? `limit ${Number(limit)}` : "";
        const { rows } = await dbQuery<PageRecord>(
          `select ${pageSelect} from pages where ${filters.join(" and ")} order by rank ${limitClause}`,
          values,
        );
        return rows;
      } catch {
        return legacyPages
          .filter((page) => (!typeId || page.type_id === typeId) && page.lang === lang && (!publishedOnly || page.published))
          .sort((a, b) => a.rank - b.rank)
          .slice(0, limit ?? legacyPages.length);
      }
    }
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
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const publishedFilter = publishedOnly ? "and published = true" : "";
        const { rows } = await dbQuery<PageRecord>(`select ${pageSelect} from pages where id = $1 ${publishedFilter} limit 1`, [id]);
        return rows[0] ?? null;
      } catch {
        return legacyPages.find((page) => page.id === id && (!publishedOnly || page.published)) ?? null;
      }
    }
    return legacyPages.find((page) => page.id === id && (!publishedOnly || page.published)) ?? null;
  }
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

export async function getSiteOptions(): Promise<Record<string, string>> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<SiteOptionRecord>("select name, value, updated_at from site_options");
        return Object.fromEntries(rows.map((row) => [row.name, row.value]));
      } catch {
        return {};
      }
    }
    return {};
  }

  const { data, error } = await supabase.from("site_options").select("name, value, updated_at");
  if (error || !data) return {};
  return Object.fromEntries(data.map((row) => [row.name, row.value]));
}

export async function getPageImages(pageId: number): Promise<FileRecord[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<FileRecord>(
          "select id, album_id, kind, extension, title, file_url, rank, created_at from files where album_id = $1 and kind = 'image' order by rank",
          [pageId],
        );
        return rows;
      } catch {
        return legacyFiles.filter((file) => file.album_id === pageId && file.kind === "image").sort((a, b) => a.rank - b.rank);
      }
    }
    return legacyFiles.filter((file) => file.album_id === pageId && file.kind === "image").sort((a, b) => a.rank - b.rank);
  }
  const { data, error } = await supabase
    .from("files")
    .select("id, album_id, kind, extension, title, file_url, rank, created_at")
    .eq("album_id", pageId)
    .eq("kind", "image")
    .order("rank");
  return error || !data ? [] : data;
}

export async function getPageFiles(albumId: number, kind: "image" | "file"): Promise<FileRecord[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<FileRecord>(
          "select id, album_id, kind, extension, title, file_url, rank, created_at from files where album_id = $1 and kind = $2 order by rank, id",
          [albumId, kind],
        );
        return rows;
      } catch {
        return legacyFiles.filter((file) => file.album_id === albumId && file.kind === kind);
      }
    }
    return legacyFiles.filter((file) => file.album_id === albumId && file.kind === kind);
  }
  const { data, error } = await supabase
    .from("files")
    .select("id, album_id, kind, extension, title, file_url, rank, created_at")
    .eq("album_id", albumId)
    .eq("kind", kind)
    .order("rank")
    .order("id");
  return error || !data ? [] : data;
}

export async function getMediaLibrary(): Promise<FileRecord[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<FileRecord>(
          "select id, album_id, kind, extension, title, file_url, rank, created_at from files where album_id = 0 order by created_at desc, id desc",
        );
        return rows;
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase
    .from("files")
    .select("id, album_id, kind, extension, title, file_url, rank, created_at")
    .eq("album_id", 0)
    .order("created_at", { ascending: false });
  return error || !data ? [] : data;
}

export async function getPageTags(pageId: number): Promise<string[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<{ tag: string }>("select tag from tags where page_id = $1 order by tag", [pageId]);
        return rows.map((row) => row.tag);
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase.from("tags").select("tag").eq("page_id", pageId).order("tag");
  return error || !data ? [] : data.map((row) => row.tag);
}

export async function getAdminDashboardData() {
  const [types, categories, pages, messages, revisions, members, orders] = await Promise.all([
    getContentTypes(),
    getCategories(),
    getPages({ publishedOnly: false, lang: "en" }),
    getMessages(),
    getRevisionRequests(),
    getMembers(),
    getOrders(),
  ]);
  return { types, categories, pages, messages, revisions, members, orders };
}

export async function getMessages(): Promise<MessageRecord[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<MessageRecord>(
          "select id, name, telephone, email, subject, message, status, created_at from messages order by created_at desc",
        );
        return rows;
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  return error || !data ? [] : data;
}

export async function getMailingList(): Promise<{ id: number; email: string; created_at: string | null }[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<{ id: number; email: string; created_at: string | null }>(
          "select id, email, created_at from mailing_list order by created_at desc",
        );
        return rows;
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase
    .from("mailing_list")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });
  return error || !data ? [] : data;
}

export async function getRevisionRequests(): Promise<RevisionRequest[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<RevisionRequest>(`select ${revisionSelect} from revision_requests order by created_at desc`);
        if (!rows.length) return rows;

        const { rows: comments } = await dbQuery<RevisionComment>(
          `select ${revisionCommentSelect} from revision_comments where revision_id = any($1::bigint[]) order by created_at asc`,
          [rows.map((revision) => revision.id)],
        );
        const commentsByRevision = new Map<number, RevisionComment[]>();
        comments.forEach((comment) => {
          commentsByRevision.set(comment.revision_id, [...(commentsByRevision.get(comment.revision_id) ?? []), comment]);
        });

        return rows.map((revision) => ({
          ...revision,
          comments: commentsByRevision.get(revision.id) ?? [],
        }));
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase
    .from("revision_requests")
    .select(revisionSelect)
    .order("created_at", { ascending: false });
  if (error || !data?.length) return [];

  const { data: comments, error: commentsError } = await supabase
    .from("revision_comments")
    .select(revisionCommentSelect)
    .in(
      "revision_id",
      data.map((revision) => revision.id),
    )
    .order("created_at", { ascending: true });

  if (commentsError || !comments) return data;

  const commentsByRevision = new Map<number, RevisionComment[]>();
  comments.forEach((comment) => {
    commentsByRevision.set(comment.revision_id, [...(commentsByRevision.get(comment.revision_id) ?? []), comment]);
  });

  return data.map((revision) => ({
    ...revision,
    comments: commentsByRevision.get(revision.id) ?? [],
  }));
}

// ===================== E-COMMERCE / MEMBERSHIP READS =====================

const memberSelect = "id, email, password_hash, full_name, country, status, created_at, updated_at";
const orderSelect =
  "id, guid, product_id, member_id, buyer_name, amount_cents, currency, status, admin_note, paypal_order_id, paypal_capture_id, created_at, updated_at";
const productSelect = "id, slug, title, price_cents, currency, active, created_at";
const bankSelect = "id, bank_name, account_name, branch_name, branch_code, account_no, iban, rank, created_at";

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const normalized = email.trim().toLowerCase();
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Member>(`select ${memberSelect} from members where lower(email) = $1 limit 1`, [normalized]);
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }
    return null;
  }
  const { data, error } = await supabase.from("members").select(memberSelect).ilike("email", normalized).limit(1).maybeSingle();
  return error || !data ? null : (data as Member);
}

export async function getMemberById(id: number): Promise<Member | null> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Member>(`select ${memberSelect} from members where id = $1 limit 1`, [id]);
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }
    return null;
  }
  const { data, error } = await supabase.from("members").select(memberSelect).eq("id", id).maybeSingle();
  return error || !data ? null : (data as Member);
}

export async function getMembers(): Promise<Member[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Member>(`select ${memberSelect} from members order by created_at desc`);
        return rows;
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase.from("members").select(memberSelect).order("created_at", { ascending: false });
  return error || !data ? [] : (data as Member[]);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Product>(`select ${productSelect} from products where slug = $1 limit 1`, [slug]);
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }
    return null;
  }
  const { data, error } = await supabase.from("products").select(productSelect).eq("slug", slug).maybeSingle();
  return error || !data ? null : (data as Product);
}

export async function getProductById(id: number): Promise<Product | null> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Product>(`select ${productSelect} from products where id = $1 limit 1`, [id]);
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }
    return null;
  }
  const { data, error } = await supabase.from("products").select(productSelect).eq("id", id).maybeSingle();
  return error || !data ? null : (data as Product);
}

export async function getOrdersForMember(memberId: number): Promise<Order[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Order>(`select ${orderSelect} from orders where member_id = $1 order by created_at desc`, [memberId]);
        return rows;
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase.from("orders").select(orderSelect).eq("member_id", memberId).order("created_at", { ascending: false });
  return error || !data ? [] : (data as Order[]);
}

export async function getOrders(): Promise<Order[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Order>(`select ${orderSelect} from orders order by created_at desc`);
        return rows;
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase.from("orders").select(orderSelect).order("created_at", { ascending: false });
  return error || !data ? [] : (data as Order[]);
}

export async function getOrderById(id: number): Promise<Order | null> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Order>(`select ${orderSelect} from orders where id = $1 limit 1`, [id]);
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }
    return null;
  }
  const { data, error } = await supabase.from("orders").select(orderSelect).eq("id", id).maybeSingle();
  return error || !data ? null : (data as Order);
}

export async function getOrderByGuid(guid: string): Promise<Order | null> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<Order>(`select ${orderSelect} from orders where guid = $1 limit 1`, [guid]);
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }
    return null;
  }
  const { data, error } = await supabase.from("orders").select(orderSelect).eq("guid", guid).maybeSingle();
  return error || !data ? null : (data as Order);
}

export async function hasCompletedOrder(memberId: number, productId: number): Promise<boolean> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<{ n: number }>(
          "select count(*)::int as n from orders where member_id = $1 and product_id = $2 and status = 'completed'",
          [memberId, productId],
        );
        return (rows[0]?.n ?? 0) > 0;
      } catch {
        return false;
      }
    }
    return false;
  }
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("member_id", memberId)
    .eq("product_id", productId)
    .eq("status", "completed");
  return !error && (count ?? 0) > 0;
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<BankAccount>(`select ${bankSelect} from bank_accounts order by rank, id`);
        return rows;
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase.from("bank_accounts").select(bankSelect).order("rank").order("id");
  return error || !data ? [] : (data as BankAccount[]);
}

export async function getProductAsset(productId: number, kind: ProductAssetKind): Promise<ProductAsset | null> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<ProductAsset>(
          "select id, product_id, kind, storage_path, filename, created_at from product_assets where product_id = $1 and kind = $2 limit 1",
          [productId, kind],
        );
        return rows[0] ?? null;
      } catch {
        return null;
      }
    }
    return null;
  }
  const { data, error } = await supabase
    .from("product_assets")
    .select("id, product_id, kind, storage_path, filename, created_at")
    .eq("product_id", productId)
    .eq("kind", kind)
    .maybeSingle();
  return error || !data ? null : (data as ProductAsset);
}

export async function getProductAssets(productId: number): Promise<ProductAsset[]> {
  const supabase = service();
  if (!supabase) {
    if (isPostgresConfigured()) {
      try {
        const { rows } = await dbQuery<ProductAsset>(
          "select id, product_id, kind, storage_path, filename, created_at from product_assets where product_id = $1 order by kind",
          [productId],
        );
        return rows;
      } catch {
        return [];
      }
    }
    return [];
  }
  const { data, error } = await supabase
    .from("product_assets")
    .select("id, product_id, kind, storage_path, filename, created_at")
    .eq("product_id", productId)
    .order("kind");
  return error || !data ? [] : (data as ProductAsset[]);
}

export { TYPE_BLOG, TYPE_PAGE, TYPE_SLIDER };
