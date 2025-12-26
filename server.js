const express = require("express");
const fetch = (...a) =>
  import("node-fetch").then(({ default: f }) => f(...a));
const cors = require("cors");

const app = express();

const WEBHOOK_URL = "https://discord.com/api/webhooks/1454100598289858776/f76cCeAFO3d4te5JLh1b_KpS8Rlt9Ip2JCorDg4GFgEbIftQ8B19zU7wYTiyL0lxedNm";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function fmt(n) {
  return Number(n || 0)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

app.post("/order", async (req, res) => {
  const o = req.body;

  console.log("NOWE ZAMÓWIENIE:", o);

  // zabezpieczenie żeby nie wyjebało map()
  const items = Array.isArray(o.items) ? o.items : [];

  const itemsText =
    items.length > 0
      ? items
          .map(
            (i) =>
              `${i.name} x${i.qty} | ${fmt(i.qty * i.price)}$`
          )
          .join("\n")
      : "Brak pozycji";

  // liczenie po stronie serwera (pewne)
  const subtotal = items.reduce(
    (a, i) => a + i.qty * i.price,
    0
  );
  const fee = Math.round(subtotal * 0.1);
  const total = subtotal + fee;

  const embed = {
    title: "🩸 NOWE ZAMÓWIENIE – WWF",
    color: 16711680,
    fields: [
      { name: "Organizacja", value: o.orgName || "BRAK" },
      { name: "Telefon IC", value: o.phoneIC || "BRAK" },
      { name: "Szef Discord", value: o.bossDiscord || "BRAK" },
      { name: "Szef FiveM", value: o.bossFiveM || "BRAK" },
      {
        name: "🛒 Zamówienie",
        value: itemsText
      },
      {
        name: "💸 Prowizja (10%)",
        value: `${fmt(fee)}$`
      },
      {
        name: "💰 Suma końcowa (z prowizją)",
        value: `${fmt(total)}$`
      },
      {
        name: "Upoważnienie",
        value: o.authorized || "BRAK"
      }
    ],
    footer: {
      text: "WWF – Czarny Rynek"
    }
  };

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] })
  });

  res.json({ ok: true });
});

app.listen(3000, () =>
  console.log("WWF działa na porcie 3000")
);
