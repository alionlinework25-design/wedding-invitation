// Checks the admin password. The password is set in Netlify:
// Site configuration -> Environment variables -> ADMIN_PASSWORD
export function checkAdmin(req) {
  const expected = (globalThis.Netlify?.env?.get("ADMIN_PASSWORD") ?? process.env.ADMIN_PASSWORD ?? "").trim();
  if (!expected) return { ok: false, status: 500, error: "ADMIN_PASSWORD is not set in Netlify yet. Please add it (see the guide)." };
  const given = (req.headers.get("x-admin-password") || "").trim();
  if (given.length !== expected.length) return { ok: false, status: 401, error: "Wrong password" };
  let diff = 0;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0 ? { ok: true } : { ok: false, status: 401, error: "Wrong password" };
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}
