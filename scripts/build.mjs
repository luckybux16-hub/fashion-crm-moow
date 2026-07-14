import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const html = await readFile("index.html", "utf8");
const hosting = await readFile(".openai/hosting.json", "utf8");
const localEnv = await readFile(".env.local", "utf8").catch(() => "");
const localEnvVars = Object.fromEntries(localEnv
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(line => line && !line.startsWith("#") && line.includes("="))
  .map(line => {
    const index = line.indexOf("=");
    return [line.slice(0, index), line.slice(index + 1)];
  }));
const envValue = key => process.env[key] || localEnvVars[key] || "";
const supabaseKey = envValue("SUPABASE_ANON_KEY") || envValue("SUPABASE_PUBLISHABLE_KEY");
const resolvedHtml = html
  .replaceAll("__SUPABASE_URL__", envValue("SUPABASE_URL"))
  .replaceAll("__SUPABASE_ANON_KEY__", supabaseKey);

await rm("dist", { recursive: true, force: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await writeFile("dist/.openai/hosting.json", hosting);
await writeFile("dist/index.html", resolvedHtml);
await writeFile(
  "dist/server/index.js",
  `const html = ${JSON.stringify(resolvedHtml)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return new Response("ok", { headers: { "content-type": "text/plain; charset=utf-8" } });
    }
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
};
`
);
