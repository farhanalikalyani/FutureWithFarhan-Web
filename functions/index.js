const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Secure Claude API proxy — keeps API key on server
exports.claudeChat = functions.https.onCall(async (data, context) => {
  // Must be authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
  }

  const { messages, systemPrompt } = data;

  if (!messages || !Array.isArray(messages)) {
    throw new functions.https.HttpsError("invalid-argument", "Messages required.");
  }

  // API key stored securely in Firebase environment config
  // Set with: firebase functions:config:set anthropic.key="sk-ant-..."
  const CLAUDE_API_KEY = functions.config().anthropic?.key;

  if (!CLAUDE_API_KEY) {
    throw new functions.https.HttpsError("internal", "API not configured.");
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: systemPrompt || "You are a helpful AI mentor for Pakistani students.",
        messages: messages.map(m => ({
          role: m.role,
          content: m.text || m.content,
        })),
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new functions.https.HttpsError("internal", responseData.error?.message || "API error");
    }

    return {
      text: responseData.content?.[0]?.text || "Sorry, no response generated.",
    };
  } catch (error) {
    console.error("Claude API error:", error);
    throw new functions.https.HttpsError("internal", "Failed to get AI response.");
  }
});
