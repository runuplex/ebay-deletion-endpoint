const express = require('express');
const crypto = require('crypto');

const app = express();

app.use(express.json());

console.log("🚨 ACTIVE EBAY SERVER RUNNING");

// ROOT ROUTE
app.get('/', (req, res) => {
  res.send('Server is running');
});

// EBAY ROUTE (MUST COME BEFORE catch-all)
app.get('/ebay/deletion', (req, res) => {
  console.log("🔥 EBAY ROUTE HIT", req.query);

  const challengeCode = req.query.challenge_code;

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

  const endpoint =
    'https://ebay-deletion-endpoint-cml9.onrender.com/ebay/deletion';

  const hash = crypto
    .createHash('sha256')
    .update(challengeCode + verificationToken + endpoint)
    .digest('hex');

  res.json({
    challengeResponse: hash
  });
});

// CATCH-ALL (must be LAST)
app.use((req, res) => {
  console.log("🔥 UNKNOWN ROUTE HIT:", req.method, req.url);
  res.status(404).send("Not found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
