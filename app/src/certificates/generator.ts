import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import { siteConfig } from "@/config/site";

interface CertificatePayload {
  certificateId: string;
  employeeName: string;
  moduleTitle: string;
  issuedAt: Date;
}

export async function generateCertificateFile(payload: CertificatePayload) {
  const baseDir = process.env.CERTIFICATES_DIR ?? "storage/certificates";
  await fs.promises.mkdir(baseDir, { recursive: true });

  const filePath = path.join(baseDir, `${payload.certificateId}.pdf`);
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#05070e");
  doc
    .fillColor("#111827")
    .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
    .fill();

  doc
    .fillColor("#f3f4f6")
    .fontSize(26)
    .font("Helvetica-Bold")
    .text(siteConfig.companyName, { align: "center", underline: true });

  doc.moveDown(2);
  doc.fontSize(22).text("Certificado de Conclusão", { align: "center" });
  doc.moveDown(1);

  doc
    .fontSize(16)
    .font("Helvetica")
    .text(
      `Certificamos que ${payload.employeeName} concluiu com sucesso o módulo ${payload.moduleTitle}.`,
      {
        align: "center",
        lineGap: 8,
      },
    );

  doc.moveDown(2);
  doc.text(`Data: ${payload.issuedAt.toLocaleDateString("pt-BR")}`, {
    align: "center",
  });

  doc.moveDown(2);
  doc.text("Assinatura", { align: "center" });
  doc.moveTo(150, doc.y + 20).lineTo(doc.page.width - 150, doc.y + 20).stroke("#f87171");

  doc.moveDown(1.5);
  doc.font("Helvetica-Bold").text(siteConfig.companyName, { align: "center" });

  doc.end();

  await new Promise<void>((resolve, reject) => {
    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });

  return filePath;
}
