export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return response.status(500).json({ error: "TELEGRAM_BOT_TOKEN is not configured" });
  }

  try {
    const { chatId, text } = request.body || {};
    const safeChatId = String(chatId || "").trim();
    const safeText = String(text || "").trim().slice(0, 3500);

    if (!safeChatId || !safeText) {
      return response.status(400).json({ error: "chatId and text are required" });
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: safeChatId,
        text: safeText,
        disable_web_page_preview: true
      })
    });

    const payload = await telegramResponse.json();
    if (!telegramResponse.ok) {
      return response.status(telegramResponse.status).json({ error: payload.description || "Telegram error" });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    return response.status(500).json({ error: "Telegram notification failed" });
  }
}
