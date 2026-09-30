import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

export class ScanError extends Error {}

const MAX_SIDE = 2400;
const QUALITY = 0.82;

async function decode(file: Blob) {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new ScanError(
      "Cette image est illisible. Essayez une photo en JPEG ou en PNG.",
    );
  }
}

export async function prepareImage(file: Blob) {
  const bitmap = await decode(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d")!;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const jpeg = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new ScanError("Impossible de préparer cette photo."))),
      "image/jpeg",
      QUALITY,
    ),
  );
  return { canvas, jpeg };
}

export async function readImageText(
  image: HTMLCanvasElement,
  onProgress: (value: number) => void,
) {
  const { createWorker, PSM } = await import("tesseract.js");
  const worker = await createWorker("fra", 1, {
    workerPath: "/ocr/worker.min.js",
    corePath: "/ocr/core",
    langPath: "/ocr/lang",
    workerBlobURL: false,
    logger: ({ status, progress }) => {
      if (status === "recognizing text") onProgress(progress);
    },
  });

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_COLUMN,
      preserve_interword_spaces: "1",
    });
    const { data } = await worker.recognize(image);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

const MAX_PAGES = 5;
const MIN_TEXT = 40;

interface TextItem {
  str: string;
  transform: number[];
  height: number;
}

function toLines(items: TextItem[]) {
  const sorted = items
    .filter((item) => item.str.trim())
    .sort((a, b) => b.transform[5]! - a.transform[5]! || a.transform[4]! - b.transform[4]!);
  const lines: { y: number; parts: string[] }[] = [];
  for (const item of sorted) {
    const y = item.transform[5]!;
    const line = lines.at(-1);
    if (line && Math.abs(line.y - y) <= Math.max(2, item.height * 0.5)) line.parts.push(item.str);
    else lines.push({ y, parts: [item.str] });
  }
  return lines.map((line) => line.parts.join(" ").replace(/\s+/g, " ").trim());
}

async function openPdf(file: Blob) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
  try {
    return { task, doc: await task.promise };
  } catch {
    await task.destroy();
    throw new ScanError("Ce PDF est illisible ou protégé par un mot de passe.");
  }
}

type PdfDoc = Awaited<ReturnType<typeof openPdf>>["doc"];

async function renderPage(doc: PdfDoc, n: number, scale: number) {
  const page = await doc.getPage(n);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvas, viewport }).promise;
  return canvas;
}

export async function readPdf(file: Blob) {
  const { task, doc } = await openPdf(file);
  try {
    const lines: string[] = [];
    for (let n = 1; n <= Math.min(doc.numPages, MAX_PAGES); n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      lines.push(...toLines(content.items as TextItem[]));
    }
    const text = lines.join("\n");
    if (text.replace(/\s/g, "").length >= MIN_TEXT) return { text, scan: null };
    return { text: null, scan: await renderPage(doc, 1, 2.5) };
  } finally {
    await task.destroy();
  }
}

export async function renderPdfPages(file: Blob) {
  const { task, doc } = await openPdf(file);
  try {
    const pages: string[] = [];
    for (let n = 1; n <= Math.min(doc.numPages, MAX_PAGES); n++)
      pages.push((await renderPage(doc, n, 1.5)).toDataURL("image/jpeg", 0.85));
    return pages;
  } finally {
    await task.destroy();
  }
}
