// Saves and loads all the invitation text & settings.
import { getStore } from "@netlify/blobs";
import { checkAdmin, json } from "../lib/auth.mjs";

const KEY = "content";

export default async (req) => {
  const store = getStore({ name: "invitation", consistency: "strong" });

  if (req.method === "GET") {
    const saved = await store.get(KEY, { type: "json" });
    if (saved) return json(saved);
    // nothing saved yet -> use the original content.json
    try {
      const res = await fetch(new URL("/content.json", req.url));
      if (res.ok) {
        return new Response(await res.text(), {
          headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
        });
      }
    } catch {}
    return json({ error: "Nothing saved yet" }, 404); // the page then reads content.json itself
  }

  const auth = checkAdmin(req);
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "Invalid data" }, 400); }
    if (!body || typeof body !== "object" || !Array.isArray(body.sections) || typeof body.settings !== "object") {
      return json({ error: "Invalid data" }, 400);
    }
    const text = JSON.stringify(body);
    if (text.length > 1_000_000) return json({ error: "Content is too large" }, 413);
    await store.setJSON(KEY, body);
    // keep a few older copies, just in case
    await store.setJSON("backup-" + Date.now(), body);
    const { blobs } = await store.list({ prefix: "backup-" });
    const old = blobs.map((b) => b.key).sort().slice(0, -10);
    await Promise.all(old.map((k) => store.delete(k)));
    return json({ ok: true });
  }

  if (req.method === "DELETE") {
    // "Reset to original"
    await store.delete(KEY);
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = { path: "/api/content" };
