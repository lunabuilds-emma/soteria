export async function readDocument(file: File): Promise<string> {
  if (file.size > 20 * 1024 * 1024) throw new Error("File exceeds 20 MB. Split it into smaller documents.");
  const extension = file.name.split(".").pop()?.toLowerCase();
  let text = "";
  if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const loading = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    const pdf = await loading.promise;
    try {
      if (pdf.numPages > 150) throw new Error("PDF exceeds 150 pages. Upload the relevant sections.");
      const pages: string[] = [];
      for (let number = 1; number <= pdf.numPages; number++) {
        const page = await pdf.getPage(number);
        const content = await page.getTextContent();
        pages.push(content.items.map((item) => "str" in item ? `${item.str}${item.hasEOL ? "\n" : " "}` : "").join(""));
        page.cleanup();
      }
      text = pages.join("\n\n");
    } finally { await loading.destroy(); }
  } else if (extension === "docx") {
    const mammoth = await import("mammoth/mammoth.browser");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    text = result.value;
  } else if (extension === "doc") {
    throw new Error("Save this older Word file as .docx or PDF, then upload it again.");
  } else if (/^(txt|md|markdown|json|csv|html?|rtf)$/.test(extension ?? "") || file.type.startsWith("text/")) {
    text = await file.text();
    if (/^html?$/.test(extension ?? "")) text = new DOMParser().parseFromString(text, "text/html").body.textContent ?? "";
  } else throw new Error("Use PDF, DOCX, TXT, Markdown, JSON, CSV, or HTML.");
  text = text.replace(/\u0000/g, "").trim();
  if (text.length < 20) throw new Error("No readable text found. For a scanned document, upload a searchable PDF or paste the text below.");
  if (text.length > 250_000) throw new Error("Document is too long. Upload the product specification sections separately.");
  return text;
}
