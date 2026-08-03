const bucket = "crm-model-photos";

function envValue(name) {
  return process.env[name] || "";
}

function dataUrlToBuffer(dataUrl) {
  const [header, body] = String(dataUrl || "").split(",");
  const mimeType = (header.match(/data:([^;]+)/) || [])[1] || "image/jpeg";
  return { buffer: Buffer.from(body || "", "base64"), mimeType };
}

function publicUrl(supabaseUrl, path) {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`;
}

export default async function handler(req, res) {
  const supabaseUrl = envValue("SUPABASE_URL");
  const serviceKey = envValue("SUPABASE_SERVICE_ROLE_KEY");
  res.setHeader("Cache-Control", "no-store");

  if (!supabaseUrl || !serviceKey) {
    res.status(500).json({ error: "Supabase Storage env vars are not configured" });
    return;
  }

  try {
    if (req.method === "POST") {
      const { path, dataUrl } = req.body || {};
      if (!path || !dataUrl || !String(path).startsWith("models/")) {
        res.status(400).json({ error: "Invalid upload payload" });
        return;
      }
      const { buffer, mimeType } = dataUrlToBuffer(dataUrl);
      if (!buffer.length || buffer.length > 3145728) {
        res.status(400).json({ error: "Invalid image size" });
        return;
      }
      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}/${path}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "content-type": mimeType,
          "x-upsert": "true"
        },
        body: buffer
      });
      const text = await response.text();
      if (!response.ok) {
        res.status(response.status).send(text);
        return;
      }
      res.status(200).json({ url: publicUrl(supabaseUrl, path) });
      return;
    }

    if (req.method === "DELETE") {
      const { path } = req.body || {};
      if (!path || !String(path).startsWith("models/")) {
        res.status(400).json({ error: "Invalid delete payload" });
        return;
      }
      const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/${bucket}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "content-type": "application/json"
        },
        body: JSON.stringify({ prefixes: [path] })
      });
      const text = await response.text();
      if (!response.ok) {
        res.status(response.status).send(text);
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Storage request failed" });
  }
}
