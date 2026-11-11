// Guest responses (RSVP + blessings).
import { getStore } from "@netlify/blobs";
import { checkAdmin, json } from "../lib/auth.mjs";

const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);

export default async (req) => {
  const store = getStore({ name: "rsvp", consistency: "strong" });

  if (req.method === "POST") {
    let b;
    try { b = await req.json(); } catch { return json({ error: "Invalid data" }, 400); }
    if (b.website) return json({ ok: true }); // spam trap
    const entry = {
      name: clean(b.name, 80),
      phone: clean(b.phone, 20),
      guests: Math.min(Math.max(parseInt(b.guests, 10) || 1, 1), 20),
      attending: b.attending === "no" ? "no" : "yes",
      message: clean(b.message, 600),
      time: new Date().toISOString(),
    };
    if (!entry.name) return json({ error: "Name is required" }, 400);
    const id = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    await store.setJSON(id, entry);
    return json({ ok: true });
  }

  const auth = checkAdmin(req);
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const items = await Promise.all(
      blobs.map(async (b) => ({ id: b.key, ...(await store.get(b.key, { type: "json" })) }))
    );
    items.sort((a, b) => (a.time < b.time ? 1 : -1));
    return json({ items });
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return json({ error: "Missing id" }, 400);
    await store.delete(id);
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = { path: "/api/rsvp" };
