import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function money(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function num(n) {
  const v = Number(n) || 0;
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function labelAplica(v) {
  if (v === "piso") return "Piso";
  if (v === "parede") return "Parede";
  if (v === "box") return "Box";
  return String(v || "");
}

/**
 * Gera PDF A4 (checklist) baseado no estado da store (resumoPorProduto).
 * @param {object} store - useAppStore()
 */
export function exportChecklistPdf(store) {
  const pdf = new jsPDF("p", "mm", "a4");

  const projeto = store?.projeto?.nome || "Sem nome";
  const now = new Date().toLocaleString("pt-BR");

  // Cabeçalho
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Obras em Casa — Checklist de Compra", 14, 16);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Projeto: ${projeto}`, 14, 22);
  pdf.text(`Gerado em: ${now}`, 14, 27);

  const areaChao = Number(store?.totalAreaChao) || 0;
  const areaParede = Number(store?.totalAreaParede) || 0;

  pdf.text(`Área piso: ${num(areaChao)} m²`, 140, 22);
  pdf.text(`Área parede+box: ${num(areaParede)} m²`, 140, 27);

  const rows = (store?.resumoPorProduto || []).map((p) => ([
    p.nome || "Produto",
    labelAplica(p.aplicaEm),
    num(p.areaNecessaria),
    num(p.caixas?.m2PorCaixa ?? 0),
    String(p.caixas ?? 0),
    p.precoPorCaixa ? money(p.precoPorCaixa) : "—",
    p.total ? money(p.total) : "—",
  ]));

  autoTable(pdf, {
    startY: 34,
    head: [[
      "Produto",
      "Aplicação",
      "m² necessário",
      "m²/caixa",
      "Caixas",
      "R$/caixa",
      "Total",
    ]],
    body: rows.length ? rows : [["Nenhum produto cadastrado.", "", "", "", "", "", ""]],
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [0, 0, 0],
    },
    columnStyles: {
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right" },
    },
  });

  // Observações
  const y = pdf.lastAutoTable?.finalY ? pdf.lastAutoTable.finalY + 8 : 120;
  pdf.setFont("helvetica", "bold");
  pdf.text("Observações", 14, y);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("• Comprar caixas inteiras (arredondamento para cima).", 14, y + 6);
  pdf.text("• Preferir mesmo lote/calibre para evitar variação de tonalidade.", 14, y + 12);
  pdf.text("• Perda aplicada conforme configurada em cada produto.", 14, y + 18);

  pdf.save("obras-em-casa-checklist.pdf");
}
