import { createSupabaseAdminClient, createSupabasePublicReadClient } from "@/lib/supabaseAdmin";
import type { Locale } from "@/lib/i18n/config";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  // English version (migration 0021). The original name/description are Spanish.
  name_en?: string | null;
  description_en?: string | null;
  price_cents: number;
  category: string;
  file_path: string;
  file_name: string;
  image_url: string | null;
  active: boolean;
  created_at: string;
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = createSupabasePublicReadClient();
  const { data, error } = await supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false });
  if (error) {
    console.error("getActiveProducts failed", error);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabasePublicReadClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).single();
  if (error) return null;
  return data;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

/** Admin-only — includes inactive products. */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("getAllProducts failed", error);
    return [];
  }
  return data ?? [];
}


/** The product with its name and description in `locale` (falls back to the other language when that one is empty). */
export function localizeProduct<T extends Product>(product: T, locale: Locale): T {
  if (locale !== "en") return product;
  const name = product.name_en?.trim();
  const description = product.description_en?.trim();
  return { ...product, name: name || product.name, description: description || product.description };
}
