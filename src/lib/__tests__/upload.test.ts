import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES, validateUpload } from "@/lib/upload";

const KB = 1024;
const MB = 1024 * KB;

describe("validateUpload", () => {
  it("acepta imágenes comunes (png, jpg, webp)", () => {
    for (const type of ["image/png", "image/jpeg", "image/webp"]) {
      expect(validateUpload({ type, size: 100 * KB })).toEqual({ ok: true });
    }
  });

  it("acepta cualquier image/* y application/pdf", () => {
    expect(validateUpload({ type: "image/gif", size: 1 * MB })).toEqual({
      ok: true,
    });
    expect(validateUpload({ type: "image/svg+xml", size: 1 * KB })).toEqual({
      ok: true,
    });
    expect(validateUpload({ type: "application/pdf", size: 2 * MB })).toEqual({
      ok: true,
    });
  });

  it("rechaza tipos no permitidos (html, ejecutables)", () => {
    for (const type of [
      "text/html",
      "application/x-msdownload",
      "application/octet-stream",
      "application/javascript",
      "video/mp4",
      "",
    ]) {
      const result = validateUpload({ type, size: 10 * KB });
      expect(result.ok).toBe(false);
    }
  });

  it("rechaza archivos mayores a 8MB", () => {
    const result = validateUpload({
      type: "image/png",
      size: MAX_UPLOAD_BYTES + 1,
    });
    expect(result.ok).toBe(false);
  });

  it("acepta exactamente 8MB", () => {
    expect(
      validateUpload({ type: "image/png", size: MAX_UPLOAD_BYTES }),
    ).toEqual({ ok: true });
  });

  it("rechaza archivos vacíos (size 0)", () => {
    const result = validateUpload({ type: "image/png", size: 0 });
    expect(result.ok).toBe(false);
  });

  it("MAX_UPLOAD_BYTES son 8MB", () => {
    expect(MAX_UPLOAD_BYTES).toBe(8 * 1024 * 1024);
  });
});
