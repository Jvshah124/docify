// pages/api/download-pdf.js
import pdf from "html-pdf-node";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { html, title } = req.body;
  if (!html) return res.status(400).json({ error: "No HTML provided" });

  try {
    const file = { content: html };
    const options = { format: "A4" };

    const buffer = await pdf.generatePdf(file, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${title || "document"}.pdf`
    );
    res.end(buffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}
