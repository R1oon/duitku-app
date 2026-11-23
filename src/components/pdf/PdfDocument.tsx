import React from "react";
import { Transaction } from "@/lib/supabase";
import {
  formatRupiah,
  formatMonthYear,
  formatHeaderDate,
  formatShortDate,
  formatTime,
} from "@/lib/format";
import {
  categorizeItem,
  aggregateByCategory,
  CATEGORY_COLORS,
} from "@/lib/categories";

interface PdfDocumentProps {
  currentDate: Date;
  transactions: Transaction[];
  ownerName?: string;
}

export const PdfDocument = React.forwardRef<HTMLDivElement, PdfDocumentProps>(
  ({ currentDate, transactions, ownerName = "Ari" }, ref) => {
    const monthName = formatMonthYear(currentDate);
    const printedDate = formatHeaderDate(new Date());

    const totalAmount = transactions.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    // Hitung metrik eksekutif
    const totalTransactions = transactions.length;
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const averagePerDay = Math.round(totalAmount / (daysInMonth || 30));
    const maxTransaction = transactions.length > 0
      ? Math.max(...transactions.map((t) => t.amount || 0))
      : 0;

    // Agregasi kategori
    const categories = aggregateByCategory(transactions);
    const topCategory = categories.length > 0 ? categories[0] : null;

    // Nomor Dokumen Formal
    const yearMonth = `${currentDate.getFullYear()}${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
    const docNumber = `DK-FIN/${yearMonth}/${ownerName.toUpperCase()}`;

    // Konfigurasi pembagian halaman
    const ROWS_PAGE_1 = 13;
    const ROWS_PAGE_2 = 24;

    const needsPage2 = transactions.length > ROWS_PAGE_1;
    const totalPages = needsPage2 ? 2 : 1;

    const page1Transactions = transactions.slice(0, ROWS_PAGE_1);
    const page2Transactions = needsPage2
      ? transactions.slice(ROWS_PAGE_1, ROWS_PAGE_1 + ROWS_PAGE_2)
      : [];

    const fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          fontFamily,
        }}
      >
        {/* ===================================================
            HALAMAN 1 — KOP MODERN, KPI CARDS, DAN TABEL UTAMA
            =================================================== */}
        <div
          id="pdf-page-1"
          className="pdf-report-page"
          style={{
            width: "794px",
            height: "1123px",
            padding: "44px 50px",
            boxSizing: "border-box",
            backgroundColor: "#FFFFFF",
            color: "#0F172A",
            fontFamily,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Header / Kop Dokumen Modern Fintech */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: "18px",
                borderBottom: "2px solid #E2E8F0",
                marginBottom: "20px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <div
                    style={{
                      backgroundColor: "#0F172A",
                      color: "#FFFFFF",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#14B8A6" }} />
                    DUITKU
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "#64748B", textTransform: "uppercase" }}>
                    Financial Statement
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "#0F172A",
                    margin: "0 0 4px 0",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Laporan Pengeluaran Bulanan
                </h1>
                <p style={{ margin: 0, fontSize: "11px", color: "#64748B" }}>
                  Jurnal pengeluaran personal dan sinkronisasi transparansi keluarga
                </p>
              </div>

              {/* Box Meta Dokumen di Kanan Atas */}
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  textAlign: "right",
                  minWidth: "190px",
                }}
              >
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  No. Dokumen
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#0F172A", fontFamily: "monospace", margin: "2px 0 6px 0" }}>
                  {docNumber}
                </div>
                <div style={{ fontSize: "10px", color: "#475569" }}>
                  <strong>Periode:</strong> {monthName}
                </div>
                <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>
                  <strong>Pemilik:</strong> {ownerName}
                </div>
              </div>
            </div>

            {/* Bagian KPI Ringkasan Keuangan (3 Cards) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              {/* Card 1: Total Pengeluaran */}
              <div
                style={{
                  backgroundColor: "#F0FDFA",
                  border: "1px solid #CCFBF1",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#0D9488", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Total Pengeluaran
                </div>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#0F766E",
                    marginTop: "4px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatRupiah(totalAmount)}
                </div>
                <div style={{ fontSize: "10px", color: "#115E59", marginTop: "2px" }}>
                  Periode {monthName}
                </div>
              </div>

              {/* Card 2: Aktivitas & Rata-rata */}
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  padding: "14px 16px",
                }}
              >
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Volume Transaksi
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>
                  {totalTransactions} <span style={{ fontSize: "12px", fontWeight: 500, color: "#64748B" }}>Catatan</span>
                </div>
                <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
                  Rata-rata: {formatRupiah(averagePerDay)}/hari
                </div>
              </div>

              {/* Card 3: Pengeluaran Puncak */}
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  padding: "14px 16px",
                }}
              >
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Kategori Dominan
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginTop: "4px" }}>
                  {topCategory ? topCategory.name : "-"}
                </div>
                <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
                  Puncak: {formatRupiah(maxTransaction)}
                </div>
              </div>
            </div>

            {/* Distribusi Kategori (Horizontal Breakdown Pills) */}
            {categories.length > 0 && (
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  marginBottom: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Porsi Kategori:
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {categories.map((cat) => {
                    const percent = totalAmount > 0 ? ((cat.value / totalAmount) * 100).toFixed(0) : "0";
                    return (
                      <div
                        key={cat.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "10px",
                          color: "#334155",
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            backgroundColor: cat.color,
                          }}
                        />
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        <span style={{ color: "#64748B", fontVariantNumeric: "tabular-nums" }}>
                          {percent}% ({formatRupiah(cat.value)})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tabel Rincian Transaksi */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "#0F172A",
                  }}
                >
                  Rincian Transaksi
                </span>
                <span style={{ fontSize: "10px", color: "#64748B" }}>
                  Halaman 1 (Menampilkan {page1Transactions.length} dari {transactions.length} data)
                </span>
              </div>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  fontSize: "10.5px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#F1F5F9", color: "#334155" }}>
                    <th style={{ padding: "8px 10px", textAlign: "center", width: "36px", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      No
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "left", width: "110px", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      Waktu
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "left", width: "95px", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      Kategori
                    </th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      Nama Barang & Catatan
                    </th>
                    <th style={{ padding: "8px 12px", textAlign: "right", width: "110px", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      Nominal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page1Transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          padding: "24px",
                          color: "#94A3B8",
                          fontStyle: "italic",
                        }}
                      >
                        Tidak ada transaksi tercatat pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    page1Transactions.map((tx, idx) => {
                      const category = categorizeItem(tx.item_name);
                      const catColor = CATEGORY_COLORS[category];

                      return (
                        <tr
                          key={tx.id}
                          style={{
                            backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                            borderBottom: idx !== page1Transactions.length - 1 ? "1px solid #F1F5F9" : "none",
                          }}
                        >
                          <td style={{ padding: "7px 10px", textAlign: "center", color: "#64748B", borderBottom: "1px solid #F1F5F9" }}>
                            {idx + 1}
                          </td>
                          <td style={{ padding: "7px 10px", color: "#334155", whiteSpace: "nowrap", borderBottom: "1px solid #F1F5F9" }}>
                            <div style={{ fontWeight: 600 }}>{formatShortDate(tx.created_at)}</div>
                            <div style={{ fontSize: "9.5px", color: "#64748B", fontFamily: "monospace" }}>
                              {formatTime(tx.created_at)}
                            </div>
                          </td>
                          <td style={{ padding: "7px 10px", borderBottom: "1px solid #F1F5F9" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: "6px",
                                fontSize: "9.5px",
                                fontWeight: 700,
                                color: catColor,
                                backgroundColor: `${catColor}15`,
                                border: `1px solid ${catColor}35`,
                              }}
                            >
                              {category}
                            </span>
                          </td>
                          <td style={{ padding: "7px 12px", color: "#0F172A", borderBottom: "1px solid #F1F5F9" }}>
                            <div style={{ fontWeight: 600 }}>{tx.item_name}</div>
                            {tx.note && (
                              <div style={{ fontSize: "9.5px", color: "#64748B", fontStyle: "italic", marginTop: "1px" }}>
                                {tx.note}
                              </div>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "7px 12px",
                              textAlign: "right",
                              fontWeight: 700,
                              color: "#0F172A",
                              fontVariantNumeric: "tabular-nums",
                              borderBottom: "1px solid #F1F5F9",
                            }}
                          >
                            {formatRupiah(tx.amount)}
                          </td>
                        </tr>
                      );
                    })
                  )}

                  {/* Jika hanya 1 Halaman, tampilkan baris Total di akhir tabel */}
                  {!needsPage2 && page1Transactions.length > 0 && (
                    <tr style={{ backgroundColor: "#F0FDFA", borderTop: "2px solid #0D9488" }}>
                      <td colSpan={4} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, fontSize: "11px", color: "#0F766E", textTransform: "uppercase" }}>
                        Total Keseluruhan :
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 900, fontSize: "13px", color: "#0F766E", fontVariantNumeric: "tabular-nums" }}>
                        {formatRupiah(totalAmount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {needsPage2 && (
                <div style={{ textAlign: "right", fontSize: "10px", color: "#64748B", fontStyle: "italic", marginTop: "6px" }}>
                  * Bersambung ke halaman 2...
                </div>
              )}
            </div>

            {/* Kolom Tanda Tangan Formal Modern (Jika Hanya 1 Halaman) */}
            {!needsPage2 && (
              <div
                style={{
                  marginTop: "24px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  padding: "0 10px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                    Mengetahui & Menyetujui
                  </div>
                  <div style={{ height: "46px" }} />
                  <div style={{ borderBottom: "1px dashed #94A3B8", width: "80%", margin: "0 auto" }} />
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#0F172A", marginTop: "6px" }}>
                    Orang Tua / Wali
                  </div>
                  <div style={{ fontSize: "9px", color: "#64748B" }}>Pemantau Realtime</div>
                </div>

                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                    Pembuat Laporan
                  </div>
                  <div style={{ height: "46px" }} />
                  <div style={{ borderBottom: "1px dashed #94A3B8", width: "80%", margin: "0 auto" }} />
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#0F172A", marginTop: "6px" }}>
                    {ownerName}
                  </div>
                  <div style={{ fontSize: "9px", color: "#64748B" }}>Pemilik Jurnal DUITKU</div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Dokumen Halaman 1 */}
          <div
            style={{
              borderTop: "1px solid #E2E8F0",
              paddingTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "9.5px",
              color: "#64748B",
            }}
          >
            <div>
              Dicetak secara digital melalui <strong>DUITKU PWA</strong> pada {printedDate}
            </div>
            <div>
              Halaman 1 dari {totalPages}
            </div>
          </div>
        </div>

        {/* ===================================================
            HALAMAN 2 — LANJUTAN TABEL (HANYA JIKA PERLU)
            =================================================== */}
        {needsPage2 && (
          <div
            id="pdf-page-2"
            className="pdf-report-page"
            style={{
              width: "794px",
              height: "1123px",
              padding: "44px 50px",
              boxSizing: "border-box",
              backgroundColor: "#FFFFFF",
              color: "#0F172A",
              fontFamily,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Header Lanjutan Halaman 2 */}
              <div
                style={{
                  borderBottom: "2px solid #E2E8F0",
                  paddingBottom: "12px",
                  marginBottom: "18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "14px", fontWeight: 800, margin: 0, color: "#0F172A" }}>
                    Laporan Pengeluaran Bulanan (Lanjutan)
                  </h2>
                  <div style={{ fontSize: "10px", color: "#64748B", marginTop: "2px" }}>
                    Periode: {monthName} • Pemilik: {ownerName}
                  </div>
                </div>
                <div style={{ fontSize: "10px", color: "#64748B", fontFamily: "monospace" }}>
                  {docNumber}
                </div>
              </div>

              {/* Tabel Lanjutan Halaman 2 */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  fontSize: "10.5px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#F1F5F9", color: "#334155" }}>
                    <th style={{ padding: "8px 10px", textAlign: "center", width: "36px", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      No
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "left", width: "110px", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      Waktu
                    </th>
                    <th style={{ padding: "8px 10px", textAlign: "left", width: "95px", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      Kategori
                    </th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      Nama Barang & Catatan
                    </th>
                    <th style={{ padding: "8px 12px", textAlign: "right", width: "110px", fontWeight: 700, borderBottom: "1px solid #E2E8F0" }}>
                      Nominal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page2Transactions.map((tx, idx) => {
                    const rowNumber = ROWS_PAGE_1 + idx + 1;
                    const category = categorizeItem(tx.item_name);
                    const catColor = CATEGORY_COLORS[category];

                    return (
                      <tr
                        key={tx.id}
                        style={{
                          backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF",
                          borderBottom: idx !== page2Transactions.length - 1 ? "1px solid #F1F5F9" : "none",
                        }}
                      >
                        <td style={{ padding: "7px 10px", textAlign: "center", color: "#64748B", borderBottom: "1px solid #F1F5F9" }}>
                          {rowNumber}
                        </td>
                        <td style={{ padding: "7px 10px", color: "#334155", whiteSpace: "nowrap", borderBottom: "1px solid #F1F5F9" }}>
                          <div style={{ fontWeight: 600 }}>{formatShortDate(tx.created_at)}</div>
                          <div style={{ fontSize: "9.5px", color: "#64748B", fontFamily: "monospace" }}>
                            {formatTime(tx.created_at)}
                          </div>
                        </td>
                        <td style={{ padding: "7px 10px", borderBottom: "1px solid #F1F5F9" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              fontSize: "9.5px",
                              fontWeight: 700,
                              color: catColor,
                              backgroundColor: `${catColor}15`,
                              border: `1px solid ${catColor}35`,
                            }}
                          >
                            {category}
                          </span>
                        </td>
                        <td style={{ padding: "7px 12px", color: "#0F172A", borderBottom: "1px solid #F1F5F9" }}>
                          <div style={{ fontWeight: 600 }}>{tx.item_name}</div>
                          {tx.note && (
                            <div style={{ fontSize: "9.5px", color: "#64748B", fontStyle: "italic", marginTop: "1px" }}>
                              {tx.note}
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "7px 12px",
                            textAlign: "right",
                            fontWeight: 700,
                            color: "#0F172A",
                            fontVariantNumeric: "tabular-nums",
                            borderBottom: "1px solid #F1F5F9",
                          }}
                        >
                          {formatRupiah(tx.amount)}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Total Keseluruhan Row di Halaman 2 */}
                  <tr style={{ backgroundColor: "#F0FDFA", borderTop: "2px solid #0D9488" }}>
                    <td colSpan={4} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, fontSize: "11px", color: "#0F766E", textTransform: "uppercase" }}>
                      Total Keseluruhan :
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 900, fontSize: "13px", color: "#0F766E", fontVariantNumeric: "tabular-nums" }}>
                      {formatRupiah(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tanda Tangan Halaman 2 */}
              <div
                style={{
                  marginTop: "30px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  padding: "0 10px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                    Mengetahui & Menyetujui
                  </div>
                  <div style={{ height: "46px" }} />
                  <div style={{ borderBottom: "1px dashed #94A3B8", width: "80%", margin: "0 auto" }} />
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#0F172A", marginTop: "6px" }}>
                    Orang Tua / Wali
                  </div>
                  <div style={{ fontSize: "9px", color: "#64748B" }}>Pemantau Realtime</div>
                </div>

                <div
                  style={{
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                    Pembuat Laporan
                  </div>
                  <div style={{ height: "46px" }} />
                  <div style={{ borderBottom: "1px dashed #94A3B8", width: "80%", margin: "0 auto" }} />
                  <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#0F172A", marginTop: "6px" }}>
                    {ownerName}
                  </div>
                  <div style={{ fontSize: "9px", color: "#64748B" }}>Pemilik Jurnal DUITKU</div>
                </div>
              </div>
            </div>

            {/* Footer Dokumen Halaman 2 */}
            <div
              style={{
                borderTop: "1px solid #E2E8F0",
                paddingTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "9.5px",
                color: "#64748B",
              }}
            >
              <div>
                Dicetak secara digital melalui <strong>DUITKU PWA</strong> pada {printedDate}
              </div>
              <div>
                Halaman 2 dari 2
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PdfDocument.displayName = "PdfDocument";
