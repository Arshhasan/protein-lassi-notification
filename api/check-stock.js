import axios from "axios";

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const RECIPIENT_NUMBER = process.env.RECIPIENT_NUMBER;

const API_URL = "https://shop.amul.com/api/1/entity/ms.products?..."; // shortened
const TARGET_ALIAS = "amul-high-protein-rose-lassi-200-ml-or-pack-of-30";

export default async function handler(req, res) {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        accept: "application/json",
        "user-agent": "Mozilla/5.0",
        cookie: process.env.AMUL_COOKIE, // store cookie in env
      },
    });

    const products = response.data?.data || [];
    const target = products.find((p) => p.alias === TARGET_ALIAS);

    if (target && (target.available > 0 || target.inventory_quantity > 0)) {
      await axios.post(
        `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: RECIPIENT_NUMBER,
          type: "text",
          text: {
            body: `🎉 ${target.name} is BACK in stock!\nPrice: ₹${target.price}\n👉 https://shop.amul.com/${target.alias}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.status(200).json({ status: "IN_STOCK" });
    } else {
      console.log("⏳ Still out of stock...");
      return res.status(200).json({ status: "OUT_OF_STOCK" });
    }
  } catch (err) {
    console.error("❌ Error checking stock:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to check stock" });
  }
}
