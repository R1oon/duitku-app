import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface GeneratePdfOptions {
  fileName?: string;
  onProgress?: (step: string) => void;
}

/**
 * Menghasilkan dokumen PDF format formal A4 Portrait (Mendukung Multi-Halaman Dinamis)
 */
export async function generateReportPdf(options: GeneratePdfOptions = {}): Promise<boolean> {
  const { fileName = "Laporan_Pengeluaran_DUITKU.pdf", onProgress } = options;

  try {
    const pages = document.querySelectorAll<HTMLElement>(".pdf-report-page");
    if (!pages || pages.length === 0) {
      throw new Error("Elemen template laporan tidak ditemukan di DOM");
    }

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

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) {
        pdf.addPage("a4", "portrait");
      }
      if (onProgress) {
        onProgress(`Menyusun Halaman ${i + 1} dari ${pages.length}...`);
      }
      const canvas = await html2canvas(pages[i], canvasOptions);
      const imgData = canvas.toDataURL("image/jpeg", 0.96);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
    }

    if (onProgress) onProgress("Mengunduh dokumen PDF...");
    pdf.save(fileName);

    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal membuat dokumen PDF formal";
    console.error("Error saat generate PDF:", error);
    throw new Error(message);
  }
}

// Alias untuk kompatibilitas
export const generate3PagePdf = generateReportPdf;
