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
  aggregateByCategory,
  CATEGORY_COLORS,
  CategoryName,
} from "@/lib/categories";

interface PdfDocumentProps {
  currentDate: Date;
  transactions: Transaction[];
  ownerName?: string;
}

export const PdfDocument = React.forwardRef<HTMLDivElement, PdfDocumentProps>(
  ({ currentDate, transactions, ownerName = "Ari" }, ref) => {
    const monthName = formatMonthYear(currentDate);
    const generatedDate = formatHeaderDate(new Date());

    const totalAmount = transactions.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    const categories = aggregateByCategory(transactions);
    const standardCategories: CategoryName[] = [
      "Makanan",
      "Minuman",
      "Transport",
      "Belanja",
      "Lainnya",
    ];

    // Palet Warna Murni HEX (Black Journal Design System)
    const C = {
      bg: "#0D0D0D",
      surface: "#161616",
      border: "#262626",
      textPrimary: "#F5F5F5",
      textSecondary: "#9CA3AF",
      accentTeal: "#14B8A6",
      tealBg: "rgba(20, 184, 166, 0.12)",
      tealBorder: "rgba(20, 184, 166, 0.35)",
    };

    const fontSans =
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const fontMono =
      '"Roboto Mono", monospace, SFMono-Regular, Menlo, Monaco, Consolas';

    return (
      <div
        ref={ref}
        style={{
          width: "794px", // A4 width at 96 DPI
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          backgroundColor: C.bg,
          color: C.textPrimary,
          fontFamily: fontSans,
        }}
      >
        {/* ===================================================
            PAGE 1 — COVER
            =================================================== */}
        <div
          id="pdf-page-1"
          style={{
            width: "794px",
            height: "1123px", // A4 height at 96 DPI
            padding: "68px", // 18mm margin
            boxSizing: "border-box",
            backgroundColor: C.bg,
            color: C.textPrimary,
            fontFamily: fontSans,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header Cover */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: "32px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: C.accentTeal,
                    fontWeight: 900,
                    fontSize: "20px",
                  }}
                >
                  D
                </span>
              </div>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "3px",
                  color: C.textPrimary,
                }}
              >
                DUITKU
              </span>
            </div>

            <div
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                fontSize: "11px",
                fontWeight: 600,
                color: C.textSecondary,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Black Journal Edition
            </div>
          </div>

          {/* Body Cover */}
          <div
            style={{
              textAlign: "center",
              margin: "auto 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                backgroundColor: C.tealBg,
                border: `1px solid ${C.tealBorder}`,
                fontSize: "12px",
                fontWeight: 700,
                color: C.accentTeal,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Laporan Keuangan Realtime
            </div>

            <h1
              style={{
                fontSize: "48px",
                fontWeight: 800,
                letterSpacing: "-1px",
                color: C.textPrimary,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Laporan Pengeluaran
            </h1>

            <div
              style={{
                fontSize: "30px",
                fontWeight: 300,
                color: C.accentTeal,
                letterSpacing: "0.5px",
              }}
            >
              {monthName}
            </div>

            <div style={{ marginTop: "32px" }}>
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  letterSpacing: "2px",
                  color: C.textSecondary,
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Pemilik Jurnal
              </span>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: C.textPrimary,
                }}
              >
                {ownerName}
              </span>
            </div>
          </div>

          {/* Footer Cover */}
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              color: C.textSecondary,
            }}
          >
            <span>Tanggal Cetak: {generatedDate}</span>
            <span>DUITKU V1 • Family Realtime Journal</span>
          </div>
        </div>

        {/* ===================================================
            PAGE 2 — SUMMARY & CATEGORY CHART
            =================================================== */}
        <div
          id="pdf-page-2"
          style={{
            width: "794px",
            height: "1123px",
            padding: "68px",
            boxSizing: "border-box",
            backgroundColor: C.bg,
            color: C.textPrimary,
            fontFamily: fontSans,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header Page 2 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: "20px",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: C.textSecondary,
                  marginBottom: "4px",
                }}
              >
                DUITKU • Ringkasan Eksekutif
              </span>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                Ringkasan {monthName}
              </h2>
            </div>
            <span
              style={{
                fontSize: "13px",
                color: C.textSecondary,
                fontFamily: fontMono,
              }}
            >
              {ownerName}
            </span>
          </div>

          {/* Content Page 2 */}
          <div
            style={{
              flex: 1,
              paddingTop: "32px",
              paddingBottom: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Metric Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{
                  padding: "24px",
                  borderRadius: "20px",
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: C.textSecondary,
                  }}
                >
                  Total Pengeluaran
                </span>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "30px",
                    fontWeight: 900,
                    color: C.accentTeal,
                    fontFamily: fontMono,
                  }}
                >
                  {formatRupiah(totalAmount)}
                </div>
              </div>

              <div
                style={{
                  padding: "24px",
                  borderRadius: "20px",
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: C.textSecondary,
                  }}
                >
                  Jumlah Transaksi
                </span>
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "30px",
                    fontWeight: 900,
                    color: C.textPrimary,
                    fontFamily: fontMono,
                  }}
                >
                  {transactions.length}{" "}
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: C.textSecondary,
                    }}
                  >
                    Catatan
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Distribution Bars */}
            <div
              style={{
                padding: "24px",
                borderRadius: "20px",
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: C.textSecondary,
                  marginTop: 0,
                  marginBottom: "20px",
                }}
              >
                Distribusi Kategori Pengeluaran
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                }}
              >
                {standardCategories.map((catName) => {
                  const catData = categories.find((c) => c.name === catName);
                  const val = catData?.value || 0;
                  const count = catData?.count || 0;
                  const percent =
                    totalAmount > 0 ? (val / totalAmount) * 100 : 0;
                  const color = CATEGORY_COLORS[catName];

                  return (
                    <div
                      key={catName}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: color,
                              display: "inline-block",
                            }}
                          />
                          <span
                            style={{
                              fontWeight: 600,
                              color: C.textPrimary,
                            }}
                          >
                            {catName}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: C.textSecondary,
                              fontFamily: fontMono,
                            }}
                          >
                            ({count}x)
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: C.textSecondary,
                              fontFamily: fontMono,
                            }}
                          >
                            {percent.toFixed(1)}%
                          </span>
                          <span
                            style={{
                              fontWeight: 700,
                              color: C.textPrimary,
                              fontFamily: fontMono,
                            }}
                          >
                            {formatRupiah(val)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar Track */}
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          borderRadius: "999px",
                          backgroundColor: C.bg,
                          border: `1px solid ${C.border}`,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            borderRadius: "999px",
                            width: `${Math.max(percent, 0)}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Page 2 */}
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              color: C.textSecondary,
            }}
          >
            <span>Generated by DUITKU</span>
            <span>Halaman 2 dari 3</span>
          </div>
        </div>

        {/* ===================================================
            PAGE 3 — FULL TABLE
            =================================================== */}
        <div
          id="pdf-page-3"
          style={{
            width: "794px",
            height: "1123px",
            padding: "68px",
            boxSizing: "border-box",
            backgroundColor: C.bg,
            color: C.textPrimary,
            fontFamily: fontSans,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header Page 3 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${C.border}`,
              paddingBottom: "20px",
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: C.textSecondary,
                  marginBottom: "4px",
                }}
              >
                DUITKU • Daftar Lengkap
              </span>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: C.textPrimary,
                  margin: 0,
                }}
              >
                Tabel Transaksi — {monthName}
              </h2>
            </div>
            <span
              style={{
                fontSize: "13px",
                color: C.textSecondary,
                fontFamily: fontMono,
              }}
            >
              Total: {transactions.length} Item
            </span>
          </div>

          {/* Table Page 3 */}
          <div style={{ flex: 1, paddingTop: "24px", overflow: "hidden" }}>
            <table
              style={{
                width: "100%",
                textAlign: "left",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${C.border}`,
                    color: C.textSecondary,
                    textTransform: "uppercase",
                    fontSize: "10px",
                    letterSpacing: "1px",
                  }}
                >
                  <th style={{ padding: "10px 12px", fontWeight: 700, width: "100px" }}>
                    Tanggal
                  </th>
                  <th style={{ padding: "10px 12px", fontWeight: 700, width: "70px" }}>
                    Jam
                  </th>
                  <th style={{ padding: "10px 12px", fontWeight: 700 }}>
                    Barang
                  </th>
                  <th
                    style={{
                      padding: "10px 12px",
                      fontWeight: 700,
                      textAlign: "right",
                      width: "120px",
                    }}
                  >
                    Nominal
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 22).map((tx) => (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      color: C.textPrimary,
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 12px",
                        whiteSpace: "nowrap",
                        color: C.textSecondary,
                        fontFamily: fontMono,
                      }}
                    >
                      {formatShortDate(tx.created_at)}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        whiteSpace: "nowrap",
                        color: C.textSecondary,
                        fontFamily: fontMono,
                      }}
                    >
                      {formatTime(tx.created_at)}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontWeight: 600, color: C.textPrimary }}>
                        {tx.item_name}
                      </span>
                      {tx.note && (
                        <span
                          style={{
                            display: "block",
                            fontSize: "10px",
                            color: C.textSecondary,
                            fontStyle: "italic",
                            marginTop: "2px",
                          }}
                        >
                          {tx.note}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        fontWeight: 700,
                        color: C.accentTeal,
                        fontFamily: fontMono,
                      }}
                    >
                      {formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {transactions.length > 22 && (
              <p
                style={{
                  fontSize: "11px",
                  color: C.textSecondary,
                  fontStyle: "italic",
                  textAlign: "center",
                  marginTop: "16px",
                }}
              >
                * Menampilkan 22 transaksi pertama pada dokumen ringkas ini.
              </p>
            )}
          </div>

          {/* Footer Page 3 (Sesuai Blueprint: "Generated by DUITKU") */}
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "12px",
              color: C.textSecondary,
            }}
          >
            <span style={{ fontWeight: 600, color: C.textPrimary }}>
              Generated by DUITKU
            </span>
            <span>Halaman 3 dari 3</span>
          </div>
        </div>
      </div>
    );
  }
);

PdfDocument.displayName = "PdfDocument";
