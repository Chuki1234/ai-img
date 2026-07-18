// =============================================================
// Pollinations.ai — sinh ảnh MIỄN PHÍ, không cần API key
// Text-to-image. Trả về danh sách data URL.
// =============================================================

export interface GenerateInput {
  prompt: string;
  model?: string; // "flux" | "turbo"
  size?: string; // "1024x1024"
  n?: number; // số ảnh
}

export interface GenerateResult {
  images: string[]; // data URL (data:image/...;base64,...)
}

export const MODELS = [
  { value: "flux", label: "flux (chất lượng cao)" },
  { value: "turbo", label: "turbo (nhanh)" },
];

export const SIZES = ["1024x1024", "1024x1792", "1792x1024", "512x512"];

async function toDataUrl(res: Response): Promise<string> {
  const buf = Buffer.from(await res.arrayBuffer());
  const ct = res.headers.get("content-type") || "image/jpeg";
  const mime = ct.startsWith("image/") ? ct : "image/jpeg";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

async function generateOne(input: GenerateInput): Promise<string> {
  const { prompt, model = "flux", size = "1024x1024" } = input;
  const [w, h] = size.split("x");
  const seed = Math.floor(Math.random() * 1_000_000);
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=${w || 1024}&height=${h || 1024}&model=${encodeURIComponent(model)}` +
    `&seed=${seed}&nologo=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations lỗi ${res.status}`);
  return toDataUrl(res);
}

export async function generate(input: GenerateInput): Promise<GenerateResult> {
  if (!input.prompt?.trim()) throw new Error("Thiếu prompt");
  const n = Math.min(Math.max(input.n || 1, 1), 4);
  const images = await Promise.all(Array.from({ length: n }, () => generateOne(input)));
  return { images };
}
