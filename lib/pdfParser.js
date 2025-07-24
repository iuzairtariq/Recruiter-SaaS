// lib/pdfParser.js

/**
 * Pdf‐parse ko “late‐load” (dynamic import) karne ka trick,
 * taake Next.js bundler compile time pe isko na include kare.
 */
export async function extractText(pdfBuffer) {
  try {
    // Dynamic import: runtime pe hi “pdf-parse” load hoga
    const { default: pdf } = await import("pdf-parse");

    // Ab pdf(pdfBuffer) ko call karo
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (err) {
    console.error("⚠️ PDF parsing failed:", err);
    throw new Error("Failed to extract text from PDF");
  }
}
