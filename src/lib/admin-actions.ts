"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
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
  const service = createSupabaseServiceClient();
  if (!service) throw new Error("Supabase service role is not configured");
  return service;
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

export async function savePage(formData: FormData) {
  const supabase = await assertAdmin();
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

  const result = parsed.id
    ? await supabase.from("pages").update(payload).eq("id", parsed.id)
    : await supabase.from("pages").insert(payload);

  if (result.error) throw new Error(result.error.message);
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function deletePage(formData: FormData) {
  const supabase = await assertAdmin();
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid page id");
  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
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
  const supabase = await assertAdmin();
  const parsed = categorySchema.parse({
    id: nullableString(formData.get("id")) || undefined,
    type_id: formData.get("type_id"),
    name: formData.get("name"),
    rank: formData.get("rank") || 0,
  });

  const result = parsed.id
    ? await supabase.from("categories").update({ type_id: parsed.type_id, name: parsed.name, rank: parsed.rank }).eq("id", parsed.id)
    : await supabase.from("categories").insert({ type_id: parsed.type_id, name: parsed.name, rank: parsed.rank });

  if (result.error) throw new Error(result.error.message);
  revalidatePath("/blogs");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function markMessageRead(formData: FormData) {
  const supabase = await assertAdmin();
  const id = Number(formData.get("id"));
  const { error } = await supabase.from("messages").update({ status: "read" }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function saveOption(formData: FormData) {
  const supabase = await assertAdmin();
  const name = String(formData.get("name") || "").trim();
  const value = String(formData.get("value") || "").trim();
  if (!name) throw new Error("Option name is required");

  const { error } = await supabase.from("site_options").upsert({ name, value }, { onConflict: "name" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}

export async function uploadPageImage(formData: FormData) {
  const supabase = await assertAdmin();
  const pageId = Number(formData.get("page_id"));
  const file = formData.get("file");
  if (!pageId || !(file instanceof File) || !file.size) throw new Error("File and page id are required");

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `pages/${pageId}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("legacy-assets").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("legacy-assets").getPublicUrl(path);
  const { error } = await supabase.from("files").insert({
    album_id: pageId,
    kind: "image",
    extension,
    title: file.name,
    file_url: data.publicUrl,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/i/${pageId}`);
  redirect("/admin/pages");
}

export async function login(formData: FormData) {
  if (!isAdminAuthConfigured()) redirect("/admin/login?error=config");
  const password = String(formData.get("password") || "");

  if (!verifyAdminPassword(password)) redirect("/admin/login?error=1");

  await setAdminSessionCookie();
  redirect("/admin");
}

const revisionSchema = z.object({
  title: z.string().trim().min(1).max(240),
  page_url: z.string().trim().max(500).nullable().optional(),
  description: z.string().trim().min(1).max(5000),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  admin_notes: z.string().trim().max(5000).nullable().optional(),
});

export async function createRevisionRequest(formData: FormData) {
  const supabase = await assertAdmin();
  const parsed = revisionSchema.parse({
    title: formData.get("title"),
    page_url: nullableString(formData.get("page_url")),
    description: formData.get("description"),
    priority: formData.get("priority") || "normal",
    admin_notes: nullableString(formData.get("admin_notes")),
  });

  const { error } = await supabase.from("revision_requests").insert({
    title: parsed.title,
    page_url: parsed.page_url,
    description: parsed.description,
    priority: parsed.priority,
    status: "new",
    admin_notes: parsed.admin_notes,
  });

  if (error) throw new Error(error.message);
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
  const supabase = await assertAdmin();
  const parsed = revisionUpdateSchema.parse({
    id: formData.get("id"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    admin_notes: nullableString(formData.get("admin_notes")),
  });

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
  revalidatePath("/admin");
  revalidatePath("/admin/revisions");
}
