// Stores pictures and music uploaded from the admin page.
import { getStore } from "@netlify/blobs";
import { checkAdmin, json } from "../lib/auth.mjs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg", "audio/wav"];
const MAX = 5.5 * 1024 * 1024;

export default async (req, context) => {
  const store = getStore({ name: "media", consistency: "strong" });
  const id = context.params?.id || decodeURIComponent(new URL(req.url).pathname.split("/api/media/")[1] || "");

  if (req.method === "GET" && id) {
    const found = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!found) return new Response("Not found", { status: 404 });
    return new Response(found.data, {
      headers: {
        "Content-Type": found.metadata?.type || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  if (req.method === "POST") {
    const auth = checkAdmin(req);
    if (!auth.ok) return json({ error: auth.error }, auth.status);
    const type = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!ALLOWED.includes(type)) return json({ error: "This file type is not supported" }, 415);
    const data = await req.arrayBuffer();
    if (!data.byteLength) return json({ error: "Empty file" }, 400);
    if (data.byteLength > MAX) return json({ error: "File is too large (max 5 MB)" }, 413);
    const ext = type.split("/")[1].replace("mpeg", "mp3").replace("x-m4a", "m4a").replace("jpeg", "jpg");
    const key = Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + "." + ext;
    await store.set(key, data, { metadata: { type } });
    return json({ ok: true, url: "/api/media/" + key });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = { path: ["/api/media", "/api/media/:id"] };
