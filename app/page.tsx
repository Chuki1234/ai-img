"use client";

import { useState } from "react";
import { MODELS, SIZES } from "@/lib/providers";

export default function Home() {
  const [model, setModel] = useState(MODELS[0].value);
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState(SIZES[0]);
  const [n, setN] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  async function onGenerate() {
    setError(null);
    if (!prompt.trim()) return setError("Vui lòng nhập prompt.");

    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt, size, n }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `Lỗi ${res.status}`);
      setResults(json.images || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="logo">🎨</div>
        <div>
          <h1>AI Image Studio</h1>
        </div>
      </div>
      <p className="subtitle">
        Tạo ảnh từ văn bản (text-to-image) bằng Pollinations.ai — miễn phí, không cần API key.
      </p>

      <div className="grid">
        {/* ---------------- Bảng điều khiển ---------------- */}
        <div className="panel">
          {/* Prompt */}
          <div className="field">
            <label className="lbl">Prompt (mô tả ảnh)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ví dụ: một chú mèo phi hành gia, phong cách tranh sơn dầu, ánh sáng điện ảnh"
            />
          </div>

          {/* Model */}
          <div className="field">
            <label className="lbl">Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tùy chọn */}
          <div className="field row">
            <div>
              <label className="lbl">Kích thước</label>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Số ảnh</label>
              <input
                type="number"
                min={1}
                max={4}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
              />
            </div>
          </div>

          <button className="btn" disabled={loading} onClick={onGenerate}>
            {loading ? "Đang tạo…" : "✨ Tạo ảnh"}
          </button>

          {error && <div className="error">❌ {error}</div>}
        </div>

        {/* ---------------- Kết quả ---------------- */}
        <div className={`panel results ${results.length === 0 && !loading ? "empty" : ""}`}>
          {loading ? (
            <div>
              <div className="spinner" />
              <div style={{ color: "var(--muted)", textAlign: "center" }}>Đang tạo ảnh…</div>
            </div>
          ) : results.length === 0 ? (
            <div>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🖼️</div>
              <div>Ảnh tạo ra sẽ hiển thị ở đây</div>
            </div>
          ) : (
            results.map((src, i) => (
              <div className="card" key={i}>
                <img src={src} alt={`kết quả ${i + 1}`} />
                <div className="bar">
                  <a href={src} download={`ai-image-${i + 1}.png`}>
                    ⬇ Tải về
                  </a>
                  <a href={src} target="_blank" rel="noreferrer">
                    ↗ Mở
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
