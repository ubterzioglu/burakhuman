"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isPostgresConfigured, query } from "./db";
import {
  createSupabaseServiceClient,
  isAdminAuthConfigured,
  requireAdmin,
  setAdminSessionCookie,
  verifyAdminPassword,
} from "./supabase";

async function assertAdmin() {
  const admin = await requireAdmin();
  if (!admin) throw new Error("Unauthorized");
  if (!createSupabaseServiceClient() && !isPostgresConfigured()) {
    throw new Error("Database connection is not configured");
  }
}

function nullableString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

const pageSchema = z.object({
  id: z.coerce.number().optional(),
  type_id: z.coerce.number().min(1),
  category_id: z.coerce.number().nullable().optional(),
  lang: z.string().trim().min(2).max(8),
  title: z.string().trim().min(1).max(240),
  summary: z.string().trim().nullable().optional(),
  body: z.string().trim().nullable().optional(),
  picture_url: z.string().trim().nullable().optional(),
  rank: z.coerce.number().default(0),
  val1: z.string().trim().nullable().optional(),
  val2: z.string().trim().nullable().optional(),
  val3: z.string().trim().nullable().optional(),
  published: z.coerce.boolean().default(false),
});

function parseTags(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .filter((tag, index, all) => all.indexOf(tag) === index)
    .slice(0, 30);
}

async function syncPageTags(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  pageId: number,
  tags: string[],
) {
  if (supabase) {
    await supabase.from("tags").delete().eq("page_id", pageId);
    if (tags.length) {
      await supabase.from("tags").insert(tags.map((tag) => ({ page_id: pageId, tag })));
    }
  } else {
    await query("delete from tags where page_id = $1", [pageId]);
    for (const tag of tags) {
      await query("insert into tags (page_id, tag) values ($1, $2) on conflict (page_id, tag) do nothing", [pageId, tag]);
    }
  }
}

export async function savePage(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = pageSchema.parse({
    id: nullableString(formData.get("id")) || undefined,
    type_id: formData.get("type_id"),
    category_id: nullableString(formData.get("category_id")) ? Number(formData.get("category_id")) : null,
    lang: formData.get("lang"),
    title: formData.get("title"),
    summary: nullableString(formData.get("summary")),
    body: nullableString(formData.get("body")),
    picture_url: nullableString(formData.get("picture_url")),
    rank: formData.get("rank") || 0,
    val1: nullableString(formData.get("val1")),
    val2: nullableString(formData.get("val2")),
    val3: nullableString(formData.get("val3")),
    published: formData.get("published") === "on",
  });
  const tags = parseTags(formData.get("tags"));

  const payload = {
    type_id: parsed.type_id,
    category_id: parsed.category_id || null,
    lang: parsed.lang,
    title: parsed.title,
    summary: parsed.summary,
    body: parsed.body,
    picture_url: parsed.picture_url,
    rank: parsed.rank,
    val1: parsed.val1,
    val2: parsed.val2,
    val3: parsed.val3,
    published: parsed.published,
    updated_at: new Date().toISOString(),
  };

  let pageId = parsed.id ?? 0;
  if (supabase) {
    if (parsed.id) {
      const { error } = await supabase.from("pages").update(payload).eq("id", parsed.id);
      if (error) throw new Error(error.message);
    } else {
      const { data, error } = await supabase.from("pages").insert(payload).select("id").single();
      if (error) throw new Error(error.message);
      pageId = data?.id ?? 0;
    }
  } else {
    if (parsed.id) {
      await query(
        `update pages
         set type_id = $1, category_id = $2, lang = $3, title = $4, summary = $5, body = $6, picture_url = $7,
             rank = $8, val1 = $9, val2 = $10, val3 = $11, published = $12, updated_at = $13
         where id = $14`,
        [
          payload.type_id,
          payload.category_id,
          payload.lang,
          payload.title,
          payload.summary,
          payload.body,
          payload.picture_url,
          payload.rank,
          payload.val1,
          payload.val2,
          payload.val3,
          payload.published,
          payload.updated_at,
          parsed.id,
        ],
      );
    } else {
      const { rows } = await query<{ id: number }>(
        `insert into pages (type_id, category_id, lang, title, summary, body, picture_url, rank, val1, val2, val3, published, updated_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning id`,
        [
          payload.type_id,
          payload.category_id,
          payload.lang,
          payload.title,
          payload.summary,
          payload.body,
          payload.picture_url,
          payload.rank,
          payload.val1,
          payload.val2,
          payload.val3,
          payload.published,
          payload.updated_at,
        ],
      );
      pageId = rows[0]?.id ?? 0;
    }
  }

  if (pageId) await syncPageTags(supabase, pageId, tags);

  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/admin/pages");
  if (pageId) revalidatePath(`/i/${pageId}`);
  redirect("/admin/pages");
}

export async function deletePage(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid page id");
  if (supabase) {
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("delete from pages where id = $1", [id]);
  }
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

const categorySchema = z.object({
  id: z.coerce.number().optional(),
  type_id: z.coerce.number().min(1),
  name: z.string().trim().min(1).max(160),
  rank: z.coerce.number().default(0),
});

export async function saveCategory(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = categorySchema.parse({
    id: nullableString(formData.get("id")) || undefined,
    type_id: formData.get("type_id"),
    name: formData.get("name"),
    rank: formData.get("rank") || 0,
  });

  if (supabase) {
    const result = parsed.id
      ? await supabase.from("categories").update({ type_id: parsed.type_id, name: parsed.name, rank: parsed.rank }).eq("id", parsed.id)
      : await supabase.from("categories").insert({ type_id: parsed.type_id, name: parsed.name, rank: parsed.rank });

    if (result.error) throw new Error(result.error.message);
  } else if (parsed.id) {
    await query("update categories set type_id = $1, name = $2, rank = $3 where id = $4", [
      parsed.type_id,
      parsed.name,
      parsed.rank,
      parsed.id,
    ]);
  } else {
    await query("insert into categories (type_id, name, rank) values ($1, $2, $3)", [parsed.type_id, parsed.name, parsed.rank]);
  }
  revalidatePath("/blogs");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid category id");

  let pageCount = 0;
  if (supabase) {
    const { count } = await supabase.from("pages").select("id", { count: "exact", head: true }).eq("category_id", id);
    pageCount = count ?? 0;
  } else {
    const { rows } = await query<{ n: number }>("select count(*)::int as n from pages where category_id = $1", [id]);
    pageCount = rows[0]?.n ?? 0;
  }
  if (pageCount > 0) redirect("/admin/categories?error=inuse");

  if (supabase) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("delete from categories where id = $1", [id]);
  }
  revalidatePath("/admin/categories");
  revalidatePath("/blogs");
  redirect("/admin/categories");
}

async function setMessageStatus(id: number, status: "new" | "read" | "archived") {
  const supabase = createSupabaseServiceClient();
  if (supabase) {
    const { error } = await supabase.from("messages").update({ status }).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("update messages set status = $1 where id = $2", [status, id]);
  }
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function markMessageRead(formData: FormData) {
  await assertAdmin();
  await setMessageStatus(Number(formData.get("id")), "read");
}

export async function markMessageArchived(formData: FormData) {
  await assertAdmin();
  await setMessageStatus(Number(formData.get("id")), "archived");
}

export async function deleteMessage(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid message id");
  if (supabase) {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("delete from messages where id = $1", [id]);
  }
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

export async function deleteMailingEntry(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid mailing entry id");
  if (supabase) {
    const { error } = await supabase.from("mailing_list").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("delete from mailing_list where id = $1", [id]);
  }
  revalidatePath("/admin/mailing");
  redirect("/admin/mailing");
}

export async function saveOption(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const name = String(formData.get("name") || "").trim();
  const value = String(formData.get("value") || "").trim();
  if (!name) throw new Error("Option name is required");

  if (supabase) {
    const { error } = await supabase.from("site_options").upsert({ name, value }, { onConflict: "name" });
    if (error) throw new Error(error.message);
  } else {
    await query(
      `insert into site_options (name, value, updated_at)
       values ($1, $2, now())
       on conflict (name) do update set value = excluded.value, updated_at = now()`,
      [name, value],
    );
  }
  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
const fileExtensions = ["pdf", "zip", "rar", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "pps", "epub", "mobi", "txt"];

export async function uploadMedia(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase service role is required for Storage uploads");
  const albumId = Number(formData.get("album_id") || 0);
  const kind = String(formData.get("kind") || "image") === "file" ? "file" : "image";
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) throw new Error("File is required");

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const allowed = kind === "image" ? imageExtensions : fileExtensions;
  if (!allowed.includes(extension)) throw new Error(`Unsupported file type: .${extension}`);

  const path = `${kind === "image" ? "images" : "files"}/${albumId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("legacy-assets").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("legacy-assets").getPublicUrl(path);
  const { error } = await supabase.from("files").insert({
    album_id: albumId,
    kind,
    extension,
    title: file.name,
    file_url: data.publicUrl,
  });
  if (error) throw new Error(error.message);

  const returnTo = nullableString(formData.get("return_to"));
  if (albumId) revalidatePath(`/i/${albumId}`);
  revalidatePath("/admin/media");
  redirect(returnTo || (albumId ? `/admin/pages?edit=${albumId}` : "/admin/media"));
}

function storagePathFromPublicUrl(fileUrl: string): string | null {
  const marker = "/storage/v1/object/public/legacy-assets/";
  const index = fileUrl.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(fileUrl.slice(index + marker.length));
}

export async function deleteFile(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  const returnTo = nullableString(formData.get("return_to")) || "/admin/media";
  if (!id) throw new Error("Invalid file id");

  if (supabase) {
    const { data: fileRow } = await supabase.from("files").select("file_url").eq("id", id).single();
    const { error } = await supabase.from("files").delete().eq("id", id);
    if (error) throw new Error(error.message);
    const path = fileRow?.file_url ? storagePathFromPublicUrl(fileRow.file_url) : null;
    if (path) await supabase.storage.from("legacy-assets").remove([path]);
  } else {
    await query("delete from files where id = $1", [id]);
  }
  revalidatePath("/admin/media");
  revalidatePath(returnTo);
  redirect(returnTo);
}

export async function setPageCover(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const pageId = Number(formData.get("page_id"));
  const fileUrl = nullableString(formData.get("file_url"));
  if (!pageId || !fileUrl) throw new Error("Page id and file url are required");

  if (supabase) {
    const { error } = await supabase
      .from("pages")
      .update({ picture_url: fileUrl, updated_at: new Date().toISOString() })
      .eq("id", pageId);
    if (error) throw new Error(error.message);
  } else {
    await query("update pages set picture_url = $1, updated_at = now() where id = $2", [fileUrl, pageId]);
  }
  revalidatePath(`/i/${pageId}`);
  revalidatePath("/admin/pages");
  redirect(`/admin/pages?edit=${pageId}`);
}

export async function reorderPage(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  const direction = String(formData.get("direction")) === "up" ? "up" : "down";
  if (!id) throw new Error("Invalid page id");

  // Ayni tip+dil icinde komsu sayfayla rank degisimi (basit ve guvenli).
  if (supabase) {
    const { data: current } = await supabase.from("pages").select("id, type_id, lang, rank").eq("id", id).single();
    if (!current) return;
    const base = supabase
      .from("pages")
      .select("id, rank")
      .eq("type_id", current.type_id)
      .eq("lang", current.lang);
    const filtered =
      direction === "up"
        ? base.lt("rank", current.rank).order("rank", { ascending: false })
        : base.gt("rank", current.rank).order("rank", { ascending: true });
    const { data: neighbors } = await filtered.limit(1);
    const neighbor = neighbors?.[0];
    if (!neighbor) return;
    await supabase.from("pages").update({ rank: neighbor.rank }).eq("id", current.id);
    await supabase.from("pages").update({ rank: current.rank }).eq("id", neighbor.id);
  } else {
    const { rows: cur } = await query<{ id: number; type_id: number; lang: string; rank: number }>(
      "select id, type_id, lang, rank from pages where id = $1",
      [id],
    );
    const current = cur[0];
    if (!current) return;
    const op = direction === "up" ? "<" : ">";
    const dir = direction === "up" ? "desc" : "asc";
    const { rows: nb } = await query<{ id: number; rank: number }>(
      `select id, rank from pages where type_id = $1 and lang = $2 and rank ${op} $3 order by rank ${dir} limit 1`,
      [current.type_id, current.lang, current.rank],
    );
    const neighbor = nb[0];
    if (!neighbor) return;
    await query("update pages set rank = $1 where id = $2", [neighbor.rank, current.id]);
    await query("update pages set rank = $1 where id = $2", [current.rank, neighbor.id]);
  }
  revalidatePath("/admin/pages");
  revalidatePath("/");
  revalidatePath("/blogs");
}

export async function login(formData: FormData) {
  if (!isAdminAuthConfigured()) redirect("/admin/login?error=config");
  const password = String(formData.get("password") || "");

  if (!verifyAdminPassword(password)) redirect("/admin/login?error=1");

  await setAdminSessionCookie();
  redirect("/admin");
}

const contentTypeSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().trim().min(1).max(120),
  title_label: z.string().trim().max(120).nullable().optional(),
  summary_label: z.string().trim().max(120).nullable().optional(),
  text_label: z.string().trim().max(120).nullable().optional(),
  has_picture: z.coerce.boolean().default(false),
  has_categories: z.coerce.boolean().default(false),
  has_tags: z.coerce.boolean().default(false),
  has_sub_images: z.coerce.boolean().default(false),
  has_sub_files: z.coerce.boolean().default(false),
  is_protected: z.coerce.boolean().default(false),
});

export async function saveContentType(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = contentTypeSchema.parse({
    id: nullableString(formData.get("id")) || undefined,
    name: formData.get("name"),
    title_label: nullableString(formData.get("title_label")),
    summary_label: nullableString(formData.get("summary_label")),
    text_label: nullableString(formData.get("text_label")),
    has_picture: formData.get("has_picture") === "on",
    has_categories: formData.get("has_categories") === "on",
    has_tags: formData.get("has_tags") === "on",
    has_sub_images: formData.get("has_sub_images") === "on",
    has_sub_files: formData.get("has_sub_files") === "on",
    is_protected: formData.get("is_protected") === "on",
  });

  const payload = {
    name: parsed.name,
    title_label: parsed.title_label,
    summary_label: parsed.summary_label,
    text_label: parsed.text_label,
    has_picture: parsed.has_picture,
    has_categories: parsed.has_categories,
    has_tags: parsed.has_tags,
    has_sub_images: parsed.has_sub_images,
    has_sub_files: parsed.has_sub_files,
    is_protected: parsed.is_protected,
  };

  if (supabase) {
    if (parsed.id) {
      const { error } = await supabase.from("content_types").update(payload).eq("id", parsed.id);
      if (error) throw new Error(error.message);
    } else {
      const { data: maxRow } = await supabase.from("content_types").select("id").order("id", { ascending: false }).limit(1);
      const nextId = (maxRow?.[0]?.id ?? 0) + 1;
      const { error } = await supabase.from("content_types").insert({ id: nextId, ...payload });
      if (error) throw new Error(error.message);
    }
  } else if (parsed.id) {
    await query(
      `update content_types set name = $1, title_label = $2, summary_label = $3, text_label = $4,
       has_picture = $5, has_categories = $6, has_tags = $7, has_sub_images = $8, has_sub_files = $9, is_protected = $10
       where id = $11`,
      [
        payload.name,
        payload.title_label,
        payload.summary_label,
        payload.text_label,
        payload.has_picture,
        payload.has_categories,
        payload.has_tags,
        payload.has_sub_images,
        payload.has_sub_files,
        payload.is_protected,
        parsed.id,
      ],
    );
  } else {
    await query(
      `insert into content_types (id, name, title_label, summary_label, text_label,
        has_picture, has_categories, has_tags, has_sub_images, has_sub_files, is_protected)
       values ((select coalesce(max(id), 0) + 1 from content_types), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        payload.name,
        payload.title_label,
        payload.summary_label,
        payload.text_label,
        payload.has_picture,
        payload.has_categories,
        payload.has_tags,
        payload.has_sub_images,
        payload.has_sub_files,
        payload.is_protected,
      ],
    );
  }
  revalidatePath("/admin/types");
  revalidatePath("/admin/pages");
  redirect("/admin/types");
}

export async function deleteContentType(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid content type id");

  // Bagli icerik/kategori varsa silme (veri butunlugu).
  let pageCount = 0;
  let categoryCount = 0;
  if (supabase) {
    const [{ count: pc }, { count: cc }] = await Promise.all([
      supabase.from("pages").select("id", { count: "exact", head: true }).eq("type_id", id),
      supabase.from("categories").select("id", { count: "exact", head: true }).eq("type_id", id),
    ]);
    pageCount = pc ?? 0;
    categoryCount = cc ?? 0;
  } else {
    const { rows: pr } = await query<{ n: number }>("select count(*)::int as n from pages where type_id = $1", [id]);
    const { rows: cr } = await query<{ n: number }>("select count(*)::int as n from categories where type_id = $1", [id]);
    pageCount = pr[0]?.n ?? 0;
    categoryCount = cr[0]?.n ?? 0;
  }

  if (pageCount > 0 || categoryCount > 0) {
    redirect("/admin/types?error=inuse");
  }

  if (supabase) {
    const { error } = await supabase.from("content_types").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("delete from content_types where id = $1", [id]);
  }
  revalidatePath("/admin/types");
  redirect("/admin/types");
}

const revisionSchema = z.object({
  title: z.string().trim().min(1).max(240),
  page_url: z.string().trim().max(500).nullable().optional(),
  description: z.string().trim().min(1).max(5000),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  admin_notes: z.string().trim().max(5000).nullable().optional(),
});

export async function createRevisionRequest(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = revisionSchema.parse({
    title: formData.get("title"),
    page_url: nullableString(formData.get("page_url")),
    description: formData.get("description"),
    priority: formData.get("priority") || "normal",
    admin_notes: nullableString(formData.get("admin_notes")),
  });

  if (supabase) {
    const { error } = await supabase.from("revision_requests").insert({
      title: parsed.title,
      page_url: parsed.page_url,
      description: parsed.description,
      priority: parsed.priority,
      status: "new",
      admin_notes: parsed.admin_notes,
    });

    if (error) throw new Error(error.message);
  } else {
    await query(
      `insert into revision_requests (title, page_url, description, priority, status, admin_notes)
       values ($1, $2, $3, $4, 'new', $5)`,
      [parsed.title, parsed.page_url, parsed.description, parsed.priority, parsed.admin_notes],
    );
  }
  revalidatePath("/admin");
  revalidatePath("/admin/revisions");
  redirect("/admin/revisions");
}

const revisionUpdateSchema = z.object({
  id: z.coerce.number().min(1),
  priority: z.enum(["low", "normal", "high"]),
  status: z.enum(["new", "in_progress", "done", "rejected"]),
  admin_notes: z.string().trim().max(5000).nullable().optional(),
});

export async function updateRevisionRequest(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = revisionUpdateSchema.parse({
    id: formData.get("id"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    admin_notes: nullableString(formData.get("admin_notes")),
  });

  if (supabase) {
    const { error } = await supabase
      .from("revision_requests")
      .update({
        priority: parsed.priority,
        status: parsed.status,
        admin_notes: parsed.admin_notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.id);

    if (error) throw new Error(error.message);
  } else {
    await query(
      "update revision_requests set priority = $1, status = $2, admin_notes = $3, updated_at = now() where id = $4",
      [parsed.priority, parsed.status, parsed.admin_notes, parsed.id],
    );
  }
  revalidatePath("/admin");
  revalidatePath("/admin/revisions");
}

const revisionCommentSchema = z.object({
  revision_id: z.coerce.number().min(1),
  body: z.string().trim().min(1).max(5000),
});

export async function createRevisionComment(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = revisionCommentSchema.parse({
    revision_id: formData.get("revision_id"),
    body: formData.get("body"),
  });

  if (supabase) {
    const { error } = await supabase.from("revision_comments").insert({
      revision_id: parsed.revision_id,
      body: parsed.body,
    });

    if (error) throw new Error(error.message);
  } else {
    await query("insert into revision_comments (revision_id, body) values ($1, $2)", [parsed.revision_id, parsed.body]);
  }

  revalidatePath("/admin/revisions");
}
