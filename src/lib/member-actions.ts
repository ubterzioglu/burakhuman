"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isPostgresConfigured, query } from "./db";
import { getMemberByEmail, getOrderByGuid, getOrderById, getProductBySlug } from "./data";
import { hashPassword, isMemberAuthConfigured, setMemberSessionCookie, verifyPassword } from "./member-auth";
import { createSupabaseServiceClient, requireAdmin } from "./supabase";

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

// ===================== PUBLIC =====================

const signupSchema = z.object({
  full_name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(240),
  password: z.string().min(8).max(200),
  country: z.string().trim().max(120).nullable().optional(),
});

export async function signupMember(formData: FormData) {
  if (!isMemberAuthConfigured()) redirect("/signup?error=config");
  const parsed = signupSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    country: nullableString(formData.get("country")),
  });
  if (!parsed.success) redirect("/signup?error=invalid");

  const email = parsed.data.email.toLowerCase();
  const existing = await getMemberByEmail(email);
  if (existing) redirect("/signup?error=exists");

  const supabase = createSupabaseServiceClient();
  const password_hash = hashPassword(parsed.data.password);
  const payload = {
    email,
    password_hash,
    full_name: parsed.data.full_name,
    country: parsed.data.country,
    status: "pending" as const,
  };

  if (supabase) {
    const { error } = await supabase.from("members").insert(payload);
    if (error) throw new Error(error.message);
  } else if (isPostgresConfigured()) {
    await query("insert into members (email, password_hash, full_name, country, status) values ($1, $2, $3, $4, 'pending')", [
      payload.email,
      payload.password_hash,
      payload.full_name,
      payload.country,
    ]);
  } else {
    throw new Error("Database connection is not configured");
  }
  redirect("/login?registered=1");
}

const loginSchema = z.object({
  email: z.string().trim().email().max(240),
  password: z.string().min(1).max(200),
});

export async function loginMember(formData: FormData) {
  if (!isMemberAuthConfigured()) redirect("/login?error=config");
  const next = nullableString(formData.get("next"));
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) redirect("/login?error=1");

  const member = await getMemberByEmail(parsed.data.email.toLowerCase());
  if (!member || !verifyPassword(parsed.data.password, member.password_hash)) {
    redirect("/login?error=1");
  }
  if (member.status !== "active") {
    redirect("/login?error=pending");
  }

  await setMemberSessionCookie(member.id);
  redirect(next && next.startsWith("/") ? next : "/product1");
}

export async function cancelPendingOrder(formData: FormData) {
  const guid = nullableString(formData.get("guid"));
  if (!guid) return;
  const order = await getOrderByGuid(guid);
  if (!order || order.status !== "pending") return;

  const supabase = createSupabaseServiceClient();
  if (supabase) {
    await supabase.from("orders").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", order.id);
  } else if (isPostgresConfigured()) {
    await query("update orders set status = 'cancelled', updated_at = now() where id = $1", [order.id]);
  }
  revalidatePath("/profile");
}

// ===================== ADMIN =====================

const memberStatusSchema = z.object({
  id: z.coerce.number().min(1),
  status: z.enum(["pending", "active", "blocked"]),
});

export async function setMemberStatus(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = memberStatusSchema.parse({ id: formData.get("id"), status: formData.get("status") });
  if (supabase) {
    const { error } = await supabase
      .from("members")
      .update({ status: parsed.status, updated_at: new Date().toISOString() })
      .eq("id", parsed.id);
    if (error) throw new Error(error.message);
  } else {
    await query("update members set status = $1, updated_at = now() where id = $2", [parsed.status, parsed.id]);
  }
  revalidatePath("/admin/members");
  redirect("/admin/members");
}

export async function toggleOrderStatus(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  const order = await getOrderById(id);
  if (!order) throw new Error("Order not found");
  const next = order.status === "completed" ? "paid" : "completed";

  if (supabase) {
    const { error } = await supabase.from("orders").update({ status: next, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("update orders set status = $1, updated_at = now() where id = $2", [next, id]);
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/profile");
  redirect("/admin/orders");
}

export async function deleteOrder(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  const order = await getOrderById(id);
  if (!order) throw new Error("Order not found");
  if (!["pending", "cancelled"].includes(order.status)) {
    redirect("/admin/orders?error=paid");
  }
  if (supabase) {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("delete from orders where id = $1", [id]);
  }
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

const orderNoteSchema = z.object({
  id: z.coerce.number().min(1),
  admin_note: z.string().trim().max(2000).nullable().optional(),
});

export async function saveOrderNote(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = orderNoteSchema.parse({ id: formData.get("id"), admin_note: nullableString(formData.get("admin_note")) });
  if (supabase) {
    const { error } = await supabase
      .from("orders")
      .update({ admin_note: parsed.admin_note, updated_at: new Date().toISOString() })
      .eq("id", parsed.id);
    if (error) throw new Error(error.message);
  } else {
    await query("update orders set admin_note = $1, updated_at = now() where id = $2", [parsed.admin_note, parsed.id]);
  }
  revalidatePath(`/admin/orders/${parsed.id}`);
  redirect(`/admin/orders/${parsed.id}`);
}

const bankSchema = z.object({
  id: z.coerce.number().optional(),
  bank_name: z.string().trim().min(1).max(160),
  account_name: z.string().trim().min(1).max(160),
  branch_name: z.string().trim().max(160).nullable().optional(),
  branch_code: z.string().trim().max(60).nullable().optional(),
  account_no: z.string().trim().max(60).nullable().optional(),
  iban: z.string().trim().max(60).nullable().optional(),
  rank: z.coerce.number().default(0),
});

export async function saveBankAccount(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = bankSchema.parse({
    id: nullableString(formData.get("id")) || undefined,
    bank_name: formData.get("bank_name"),
    account_name: formData.get("account_name"),
    branch_name: nullableString(formData.get("branch_name")),
    branch_code: nullableString(formData.get("branch_code")),
    account_no: nullableString(formData.get("account_no")),
    iban: nullableString(formData.get("iban")),
    rank: formData.get("rank") || 0,
  });
  const payload = {
    bank_name: parsed.bank_name,
    account_name: parsed.account_name,
    branch_name: parsed.branch_name,
    branch_code: parsed.branch_code,
    account_no: parsed.account_no,
    iban: parsed.iban,
    rank: parsed.rank,
  };

  if (supabase) {
    const result = parsed.id
      ? await supabase.from("bank_accounts").update(payload).eq("id", parsed.id)
      : await supabase.from("bank_accounts").insert(payload);
    if (result.error) throw new Error(result.error.message);
  } else if (parsed.id) {
    await query(
      "update bank_accounts set bank_name = $1, account_name = $2, branch_name = $3, branch_code = $4, account_no = $5, iban = $6, rank = $7 where id = $8",
      [payload.bank_name, payload.account_name, payload.branch_name, payload.branch_code, payload.account_no, payload.iban, payload.rank, parsed.id],
    );
  } else {
    await query(
      "insert into bank_accounts (bank_name, account_name, branch_name, branch_code, account_no, iban, rank) values ($1, $2, $3, $4, $5, $6, $7)",
      [payload.bank_name, payload.account_name, payload.branch_name, payload.branch_code, payload.account_no, payload.iban, payload.rank],
    );
  }
  revalidatePath("/admin/bank-accounts");
  revalidatePath("/product1");
  redirect("/admin/bank-accounts");
}

export async function deleteBankAccount(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const id = Number(formData.get("id"));
  if (!id) throw new Error("Invalid bank account id");
  if (supabase) {
    const { error } = await supabase.from("bank_accounts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    await query("delete from bank_accounts where id = $1", [id]);
  }
  revalidatePath("/admin/bank-accounts");
  redirect("/admin/bank-accounts");
}

const productSchema = z.object({
  id: z.coerce.number().min(1),
  title: z.string().trim().min(1).max(200),
  price_cents: z.coerce.number().min(0),
  active: z.coerce.boolean().default(true),
});

export async function saveProduct(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  const parsed = productSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    price_cents: formData.get("price_cents"),
    active: formData.get("active") === "on",
  });
  if (supabase) {
    const { error } = await supabase
      .from("products")
      .update({ title: parsed.title, price_cents: parsed.price_cents, active: parsed.active })
      .eq("id", parsed.id);
    if (error) throw new Error(error.message);
  } else {
    await query("update products set title = $1, price_cents = $2, active = $3 where id = $4", [
      parsed.title,
      parsed.price_cents,
      parsed.active,
      parsed.id,
    ]);
  }
  revalidatePath("/admin/bank-accounts");
  revalidatePath("/product1");
  redirect("/admin/bank-accounts");
}

const assetKinds = ["mobi", "epub", "pdf", "cover"] as const;

export async function uploadProductAsset(formData: FormData) {
  await assertAdmin();
  const supabase = createSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase service role is required for protected asset uploads");
  const productId = Number(formData.get("product_id"));
  const kind = String(formData.get("kind") || "");
  const file = formData.get("file");
  if (!productId || !assetKinds.includes(kind as (typeof assetKinds)[number])) throw new Error("Product and asset kind are required");
  if (!(file instanceof File) || !file.size) throw new Error("File is required");

  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `products/${productId}/${kind}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("member-assets").upload(path, file, {
    cacheControl: "0",
    upsert: true,
    contentType: file.type || undefined,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await supabase
    .from("product_assets")
    .upsert({ product_id: productId, kind, storage_path: path, filename: file.name }, { onConflict: "product_id,kind" });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bank-accounts");
  redirect("/admin/bank-accounts");
}
