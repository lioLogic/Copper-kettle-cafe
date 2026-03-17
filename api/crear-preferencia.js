export default async function handler(req, res) {
  const { items, payer } = req.body;

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer TEST-APP_USR-583756990100420-031208-d69de8e4a45e6dc08a239304c9fbb038-3260786029"
    },
    body: JSON.stringify({ items, payer })
  });

  const data = await response.json();
  res.status(200).json(data);
}