exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body || "{}");
    if (!email) return { statusCode: 400, body: "Missing email" };

    const MAILERLITE_TOKEN = process.env.MAILERLITE_TOKEN;
    const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

    const url = "https://connect.mailerlite.com/api/subscribers";

    const mlRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MAILERLITE_TOKEN}`
      },
      body: JSON.stringify({
        email,
        groups: [GROUP_ID],
        status: "active"
      })
    });

    if (!mlRes.ok) {
      const t = await mlRes.text();
      return { statusCode: 500, body: t };
    }

    return { statusCode: 200, body: "ok" };

  } catch (e) {
    return { statusCode: 500, body: e.toString() };
  }
};
