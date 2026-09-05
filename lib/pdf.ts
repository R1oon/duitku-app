import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface GeneratePdfOptions {
  fileName?: string;
  onProgress?: (step: string) => void;
}

/**
 * Menghasilkan dokumen PDF format formal A4 Portrait (1 atau 2 halaman)
 */
export async function generateReportPdf(options: GeneratePdfOptions = {}): Promise<boolean> {
  const { fileName = "Laporan_Pengeluaran_DUITKU.pdf", onProgress } = options;

  try {
    const page1 = document.getElementById("pdf-page-1");
    if (!page1) {
      throw new Error("Elemen template laporan tidak ditemukan di DOM");
    }

    const page2 = document.getElementById("pdf-page-2");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const canvasOptions = {
      scale: 2, // Kualitas tajam setara 300 DPI
      useCORS: true,
      backgroundColor: "#FFFFFF",
      logging: false,
    };

    // Render Halaman 1
    if (onProgress) onProgress("Menyusun Halaman 1...");
    const canvas1 = await html2canvas(page1, canvasOptions);
    const imgData1 = canvas1.toDataURL("image/jpeg", 0.96);
    pdf.addImage(imgData1, "JPEG", 0, 0, 210, 297);

    // Render Halaman 2 (jika transaksi lebih dari 1 halaman)
    if (page2) {
      if (onProgress) onProgress("Menyusun Halaman 2...");
      pdf.addPage("a4", "portrait");
      const canvas2 = await html2canvas(page2, canvasOptions);
      const imgData2 = canvas2.toDataURL("image/jpeg", 0.96);
      pdf.addImage(imgData2, "JPEG", 0, 0, 210, 297);
    }

    if (onProgress) onProgress("Mengunduh dokumen PDF...");
    pdf.save(fileName);

    return true;
  } catch (error: any) {
    console.error("Error saat generate PDF:", error);
    throw new Error(error.message || "Gagal membuat dokumen PDF formal");
  }
}

// Alias untuk kompatibilitas
export const generate3PagePdf = generateReportPdf;
