import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase, Transaction } from "./supabase";

export const TRANSACTIONS_CHANNEL = "transactions-realtime";

export type RealtimeTransactionHandler = (
  payload: RealtimePostgresChangesPayload<Transaction>
) => void;

/**
 * Helper untuk subscribe ke perubahan realtime tabel transactions
 */
export function subscribeToTransactions(onPayload: RealtimeTransactionHandler) {
  const channel = supabase
    .channel(TRANSACTIONS_CHANNEL)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "transactions",
      },
      (payload) => {
        onPayload(payload as RealtimePostgresChangesPayload<Transaction>);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
