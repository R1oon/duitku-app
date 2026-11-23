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
  let active = true;
  let currentChannel: ReturnType<typeof supabase.channel> | null = null;

  function initChannel() {
    if (!active) return;
    if (currentChannel) {
      supabase.removeChannel(currentChannel);
    }

    const uniqueChannel = `${channelPrefix}-${Math.random().toString(36).slice(2, 8)}`;
    currentChannel = supabase
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
        if (onStatusChange && active) {
          onStatusChange(status);
        }
      });
  }

  initChannel();

  // Auto-reconnect saat tab kembali aktif atau sinyal internet pulih
  const handleVisibilityOrOnline = () => {
    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      initChannel();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("online", handleVisibilityOrOnline);
    document.addEventListener("visibilitychange", handleVisibilityOrOnline);
  }

  return () => {
    active = false;
    if (typeof window !== "undefined") {
      window.removeEventListener("online", handleVisibilityOrOnline);
      document.removeEventListener("visibilitychange", handleVisibilityOrOnline);
    }
    if (currentChannel) {
      supabase.removeChannel(currentChannel);
    }
  };
}
