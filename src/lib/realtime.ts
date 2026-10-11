import { RealtimePostgresChangesPayload, REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { supabase, Transaction } from "./supabase";

export type RealtimeTransactionHandler = (
  payload: RealtimePostgresChangesPayload<Transaction>
) => void;

/**
 * Helper untuk subscribe ke perubahan realtime tabel transactions
 * Menggunakan channel name unik agar isolasi subscription antar tab/halaman tetap terjamin
 */
export function subscribeToTransactions(
  onPayload: RealtimeTransactionHandler,
  onStatusChange?: (status: `${REALTIME_SUBSCRIBE_STATES}`) => void,
  channelPrefix = "transactions"
) {
  const uniqueChannel = `${channelPrefix}-${Math.random().toString(36).slice(2, 8)}`;
  
  const channel = supabase
    .channel(uniqueChannel)
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
    .subscribe((status) => {
      if (onStatusChange) {
        onStatusChange(status);
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
