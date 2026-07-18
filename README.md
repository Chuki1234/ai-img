# AI Image Studio 🎨

Web Next.js tạo ảnh từ văn bản (**text-to-image**) bằng **Pollinations.ai** — **miễn phí, không cần API key**.

## Chạy dev

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Cách dùng

1. Nhập **Prompt** (mô tả ảnh muốn tạo).
2. Chọn **Model** (`flux` chất lượng cao / `turbo` nhanh), **Kích thước**, **Số ảnh**.
3. Bấm **Tạo ảnh** → ảnh hiện bên phải, có nút tải về.

## Cấu trúc

- `lib/providers.ts` — gọi API Pollinations, trả về ảnh dạng data URL.
- `app/api/generate/route.ts` — route server-side proxy.
- `app/page.tsx` — giao diện.

Pollinations không yêu cầu key nên không có gì để cấu hình thêm.
