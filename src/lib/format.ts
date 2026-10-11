/**
 * Utility formater sesuai spesifikasi Black Journal DUITKU
 */

/**
 * Format nominal angka ke format Rupiah tanpa spasi: "Rp10.000"
 */
export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount || 0);
  return `Rp${formatted}`;
}

/**
 * Format waktu ke format jam:menit (24 jam): "12:41"
 */
export function formatTime(dateStringOrDate: string | Date): string {
  const date = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;
  if (isNaN(date.getTime())) return "--:--";

  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(".", ":");
}

/**
 * Format tanggal lengkap untuk Header: "Sabtu, 5 September 2026"
 */
export function formatHeaderDate(dateStringOrDate: string | Date = new Date()): string {
  const date = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format tanggal singkat: "5 Sep 2026"
 */
export function formatShortDate(dateStringOrDate: string | Date): string {
  const date = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format bulan & tahun untuk rekap bulanan: "November 2026"
 */
export function formatMonthYear(dateStringOrDate: string | Date = new Date()): string {
  const date = typeof dateStringOrDate === "string" ? new Date(dateStringOrDate) : dateStringOrDate;
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}
