export async function POST(req: Request) {
  const webhookUrl = process.env.ZOHO_FLOW_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const { firstName, lastName, email, company, message } = await req.json();

  if (!firstName || !lastName || !email || !message) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, company: company ?? "", message }),
  });

  if (!res.ok) {
    return Response.json({ error: "Zoho request failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}