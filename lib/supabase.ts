import { createClient } from "@supabase/supabase-js";

export type Transaction = {
  id: string;
  created_at: string;
  item_name: string;
  amount: number;
  note?: string | null;
};

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction;
        Insert: {
          id?: string;
          created_at?: string;
          item_name: string;
          amount: number;
          note?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          item_name?: string;
          amount?: number;
          note?: string | null;
        };
      };
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-anon-key"
  );
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
