import { createClient } from "@supabase/supabase-js";

export type Transaction = {
  id: string;
  created_at: string;
  item_name: string;
  amount: number;
  note?: string | null;
};

export type TransactionInsert = {
  id?: string;
  created_at?: string;
  item_name: string;
  amount: number;
  note?: string | null;
};

export type TransactionUpdate = {
  item_name?: string;
  amount?: number;
  note?: string | null;
};

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction;
        Insert: TransactionInsert;
        Update: TransactionUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

function normalizeUrl(url?: string): string {
  if (!url) return "https://placeholder.supabase.co";
  return url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    rawUrl &&
    rawKey &&
    !rawUrl.includes("placeholder.supabase.co") &&
    rawKey !== "placeholder-anon-key"
  );
};

const supabaseUrl = normalizeUrl(rawUrl);
const supabaseAnonKey = rawKey?.trim() || "placeholder-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export * from "./transactions";
