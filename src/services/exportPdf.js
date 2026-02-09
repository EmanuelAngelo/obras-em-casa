import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Gera PDF A4 a partir de um elemento HTML (print-friendly).
 * @param {HTMLElement} el
 * @param {string} filename
 */
export async function exportElementToPdf(el, filename = "obras-em-casa-checklist.pdf") {
  if (!el) throw new Error("Elemento para exportação não encontrado.");

  // Renderiza elemento em canvas
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // dimensões da imagem no PDF mantendo proporção
  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let y = 0;
  let heightLeft = imgHeight;

  pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Se passar de 1 página, quebra automaticamente
  while (heightLeft > 0) {
    pdf.addPage();
    y = - (imgHeight - heightLeft);
    pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
