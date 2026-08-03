const allowedPrefix = "/rest/v1/";

function envValue(name) {
  return process.env[name] || "";
}

export default async function handler(req, res) {
  const supabaseUrl = envValue("SUPABASE_URL");
  const supabaseKey = envValue("SUPABASE_ANON_KEY") || envValue("SUPABASE_PUBLISHABLE_KEY");
  const rawPath = Array.isArray(req.query?.path) ? req.query.path[0] : req.query?.path;
  const path = String(rawPath || "");

  res.setHeader("Cache-Control", "no-store");

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).send("Supabase env vars are not configured");
    return;
  }
  if (!path.startsWith(allowedPrefix)) {
    res.status(400).send("Unsupported Supabase path");
    return;
  }

  const method = req.method || "GET";
  const headers = {
    apikey: supabaseKey,
    authorization: `Bearer ${supabaseKey}`,
    "content-type": req.headers["content-type"] || "application/json"
  };
  if (req.headers.prefer) headers.prefer = req.headers.prefer;

  const body = ["GET", "HEAD"].includes(method)
    ? undefined
    : typeof req.body === "string"
      ? req.body
      : JSON.stringify(req.body ?? {});

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}${path}`, { method, headers, body });
    const text = await response.text();
    res.status(response.status);
    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("content-type", contentType);
    res.send(text);
  } catch (error) {
    res.status(502).send(error?.message || "Supabase proxy failed");
  }
}
