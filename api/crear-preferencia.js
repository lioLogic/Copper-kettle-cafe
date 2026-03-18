export default async function handler(req, res) {
  const { items, payer } = req.body;

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer TEST-APP_USR-5127398726888064-031208-885cd7db4a6214673bd00b8146223942-2226836935"
    },
    body: JSON.stringify({ items, payer })
  });

  const data = await response.json();
  res.status(200).json(data);
}