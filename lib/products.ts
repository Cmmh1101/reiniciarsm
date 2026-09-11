import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  category: string;
  file_path: string;
  file_name: string;
  active: boolean;
  created_at: string;
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: false });
  if (error) {
    console.error("getActiveProducts failed", error);
    return [];
  }
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createSupabaseAdminClient();
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

