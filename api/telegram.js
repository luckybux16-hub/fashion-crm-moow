export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return response.status(500).json({ error: "TELEGRAM_BOT_TOKEN is not configured" });
  }

  try {
    const { action, chatId, text, login, email } = request.body || {};

    if (action === "checkBot") {
      const meResponse = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const mePayload = await meResponse.json();
      if (!meResponse.ok) {
        return response.status(meResponse.status).json({ error: mePayload.description || "Telegram token check failed" });
      }
      return response.status(200).json({ ok: true, bot: mePayload.result });
    }

    if (action === "findChatId") {
      const needleValues = [login, email].map(value => String(value || "").trim().toLowerCase()).filter(Boolean);
      if (!needleValues.length) {
        return response.status(400).json({ error: "login or email is required" });
      }

      const updatesResponse = await fetch(`https://api.telegram.org/bot${token}/getUpdates?limit=100&allowed_updates=${encodeURIComponent(JSON.stringify(["message"]))}`);
      const updatesPayload = await updatesResponse.json();
      if (!updatesResponse.ok) {
        return response.status(updatesResponse.status).json({ error: updatesPayload.description || "Telegram error" });
      }

      const updates = Array.isArray(updatesPayload.result) ? updatesPayload.result.slice().reverse() : [];
      const match = updates.find(update => {
        const message = update.message;
        const messageText = String(message?.text || "").trim().toLowerCase();
        const normalized = messageText.replace(/^\/start(@[a-z0-9_]+)?\s*/i, "").trim();
        return message?.chat?.id && needleValues.some(value => normalized === value || messageText === `/start ${value}` || messageText.includes(value));
      });

      if (!match) {
        return response.status(404).json({
          error: "chat id not found",
          hint: `Ask the user to send /start ${needleValues[0]} to the bot, then click Find ID again.`,
          updatesChecked: updates.length,
          recentMessages: updates.slice(0, 5).map(update => ({
            text: update.message?.text || "",
            username: update.message?.chat?.username || "",
            name: [update.message?.chat?.first_name, update.message?.chat?.last_name].filter(Boolean).join(" ")
          }))
        });
      }

      return response.status(200).json({
        ok: true,
        chatId: String(match.message.chat.id),
        name: [match.message.chat.first_name, match.message.chat.last_name].filter(Boolean).join(" "),
        username: match.message.chat.username || ""
      });
    }

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
