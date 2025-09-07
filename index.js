
// import axios from "axios";
// import cron from "node-cron";

// // Your Meta credentials
// const PHONE_NUMBER_ID = "782553711608856";
// const ACCESS_TOKEN = "EAASWyGOcg7cBPZAfargXOQ3go5fnK9ZB0OmNCe4QDbc2hcHglkVYNzOQa3hLc75zoU60zBX0bTSKKKng9i1iEzwyJ5ZBSzhkKmdE57C3e7ZBrZASbhYKXZCFF6VPUs3TXbUd7gIQuyAE6bRsYPhWALV4DImF5Vx71H0oPyJSaRWbXspaoZBeVxPajOVYZCwJ6ucONmzisCOLlYQBZBYvdJbiMO5ZA3irF4guitSFsZBJZCMurll2hgZDZD";
// const RECIPIENT_NUMBER = "919971433169";

// // Amul API
// const API_URL = "https://shop.amul.com/api/1/entity/ms.products?fields[name]=1&fields[available]=1&fields[inventory_quantity]=1&fields[alias]=1&filters[0][field]=categories&filters[0][operator]=in&filters[0][original]=1&filters[0][value][0]=protein&limit=24&start=0";

// const TARGET_ALIAS = "amul-high-protein-rose-lassi-200-ml-or-pack-of-30";

// async function sendWhatsAppMessage(text) {
//   try {
//     const res = await axios.post(
//       `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to: RECIPIENT_NUMBER,
//         type: "text",
//         text: { body: text },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${ACCESS_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("✅ WhatsApp message sent!", res.data);
//   } catch (err) {
//     console.error("❌ Error sending WhatsApp:", err.response?.data || err.message);
//   }
// }

// async function checkStock() {
//   try {
//     const res = await axios.get(API_URL);
//     const products = res.data?.data || [];

//     const target = products.find((p) => p.alias === TARGET_ALIAS);

//     if (target && (target.available > 0 || target.inventory_quantity > 0)) {
//       console.log(`🎉 ${target.name} is in stock!`);
//       await sendWhatsAppMessage(
//         `🎉 ${target.name} is BACK in stock!\nPrice: ₹${target.price || "N/A"}\n👉 https://shop.amul.com/${target.alias}`
//       );
//     } else {
//       console.log("⏳ Still out of stock...");
//     }
//   } catch (err) {
//     console.error("❌ Error checking stock:", err.response?.data || err.message);
//   }
// }

// // Run every 10 seconds (for testing), change to "*/5 * * * *" for 5 min in production
// // cron.schedule("*/10 * * * * *", checkStock);
// cron.schedule("*/5 * * * * *", checkStock); // runs every 10 seconds

// console.log("🚀 WhatsApp stock watcher started...");


import axios from "axios";
import cron from "node-cron";

// Your Meta credentials
const PHONE_NUMBER_ID = "782553711608856";
const ACCESS_TOKEN = "EAASWyGOcg7cBPZAfargXOQ3go5fnK9ZB0OmNCe4QDbc2hcHglkVYNzOQa3hLc75zoU60zBX0bTSKKKng9i1iEzwyJ5ZBSzhkKmdE57C3e7ZBrZASbhYKXZCFF6VPUs3TXbUd7gIQuyAE6bRsYPhWALV4DImF5Vx71H0oPyJSaRWbXspaoZBeVxPajOVYZCwJ6ucONmzisCOLlYQBZBYvdJbiMO5ZA3irF4guitSFsZBJZCMurll2hgZDZD";
const RECIPIENT_NUMBER = "919971433169";

// Amul API
const API_URL =
  "https://shop.amul.com/api/1/entity/ms.products?fields[name]=1&fields[brand]=1&fields[categories]=1&fields[collections]=1&fields[alias]=1&fields[sku]=1&fields[price]=1&fields[compare_price]=1&fields[original_price]=1&fields[images]=1&fields[metafields]=1&fields[discounts]=1&fields[catalog_only]=1&fields[is_catalog]=1&fields[seller]=1&fields[available]=1&fields[inventory_quantity]=1&fields[net_quantity]=1&fields[num_reviews]=1&fields[avg_rating]=1&fields[inventory_low_stock_quantity]=1&fields[inventory_allow_out_of_stock]=1&fields[default_variant]=1&fields[variants]=1&fields[lp_seller_ids]=1&filters[0][field]=categories&filters[0][value][0]=protein&filters[0][operator]=in&filters[0][original]=1&facets=true&facetgroup=default_category_facet&limit=32&total=1&start=0&cdc=1m&substore=66505ff5af6a3c7411d2f4b2";

const AMUL_HEADERS = {
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9",
  cookie: "jsessionid=s%3A3F0Hd%2BvrTW8wMlM3Ve0idE%2Fu.S5YIVgU6D80RCOcZ3B7XNkoqasn%2BUWCE%2F%2FF2CFFVpq4; _ga=GA1.1.1011787785.1757142251; _fbp=fb.1.1757142251056.674674714950184513; __cf_bm=1DWZej3LLVmsfiythvxwnVEpTmgbhz832yBd4KdyxXE-1757157509-1.0.1.1-wi7JYFvSsbf1.YAEEiBBwNZsYsfHwDfV4Rh5QhwIoJ7.SGsJxrPWDkHUaDSRVvD3NLQUAgxeZ4bPDjDAWY2E9Xw8syhWhctPErvs2kt1aX8; _ga_E69VZ8HPCN=GS2.1.s1757157509$o2$g1$t1757157512$j57$l0$h2142840593; frontend=1;",
  dnt: "1",
  frontend: "1",
  "user-agent": "Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36"
};

const TARGET_ALIAS = "amul-high-protein-rose-lassi-200-ml-or-pack-of-30";

async function sendWhatsAppMessage(text) {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: RECIPIENT_NUMBER,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ WhatsApp message sent!", res.data);
  } catch (err) {
    console.error("❌ Error sending WhatsApp:", err.response?.data || err.message);
  }
}

async function checkStock() {
  try {
    const res = await axios.get(API_URL, { headers: AMUL_HEADERS });
    const products = res.data?.data || [];

    const target = products.find((p) => p.alias === TARGET_ALIAS);

    if (target && (target.available > 0 || target.inventory_quantity > 0)) {
      console.log(`🎉 ${target.name} is in stock!`);
      await sendWhatsAppMessage(
        `🎉 ${target.name} is BACK in stock!\nPrice: ₹${target.price || "N/A"}\n👉 https://shop.amul.com/${target.alias}`
      );
    } else {
      console.log("⏳ Still out of stock...");
    }
  } catch (err) {
    console.error("❌ Error checking stock:", err.response?.data || err.message);
  }
}

// Run every 10 seconds (for testing)
cron.schedule("*/10 * * * * *", checkStock);

console.log("🚀 WhatsApp stock watcher started...");
