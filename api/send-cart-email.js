export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const apiKey = process.env.AHASEND_API_KEY;
  const accountId = process.env.AHASEND_ACCOUNT_ID;

  if (!apiKey || !accountId) {
    return res.status(500).send("Missing AHASEND_API_KEY or AHASEND_ACCOUNT_ID");
  }

  try {
    const endpoint = `https://api.ahasend.com/v2/accounts/${encodeURIComponent(accountId)}/messages`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending email");
  }
}
