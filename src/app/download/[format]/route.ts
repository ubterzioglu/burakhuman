import { NextResponse } from "next/server";
import { getProductAsset, getProductBySlug, hasCompletedOrder } from "@/lib/data";
import { getCurrentMember } from "@/lib/member-auth";
import { createSupabaseServiceClient } from "@/lib/supabase";
import type { ProductAssetKind } from "@/lib/types";

const validFormats: ProductAssetKind[] = ["mobi", "epub", "pdf", "cover"];

export async function GET(request: Request, { params }: { params: Promise<{ format: string }> }) {
  const { format } = await params;
  if (!validFormats.includes(format as ProductAssetKind)) {
    return NextResponse.json({ error: "Unknown format" }, { status: 404 });
  }

  const member = await getCurrentMember();
  if (!member) return NextResponse.redirect(new URL("/login?next=/product1", request.url));

  const product = await getProductBySlug("hcd-ebook");
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const allowed = await hasCompletedOrder(member.id, product.id);
  if (!allowed) return NextResponse.json({ error: "No completed order for this product" }, { status: 403 });

  const asset = await getProductAsset(product.id, format as ProductAssetKind);
  if (!asset) return NextResponse.json({ error: "File not available yet" }, { status: 404 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Downloads require Supabase Storage" }, { status: 503 });
  }

  const { data, error } = await supabase.storage.from("member-assets").createSignedUrl(asset.storage_path, 60, {
    download: asset.filename,
  });
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Could not create download link" }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
