const express = require('express');
const app = express();

console.log("🔥 SERVER FILE LOADED");

app.get('/', (req, res) => {
  console.log("ROOT HIT");
  res.send("ROOT OK");
});

app.get('/ebay/deletion', (req, res) => {
  console.log("🔥 EBAY ROUTE HIT");
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("LISTENING ON", PORT));
