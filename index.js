const express = require('express');
const crypto = require('crypto');

const app = express();

app.use(express.json());

// Startup check (helps confirm correct deploy)
console.log("🚨 ACTIVE EBAY DELETION SERVICE RUNNING");

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// eBay deletion / CRC verification endpoint
app.get('/ebay/deletion', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

  if (!verificationToken) {
    return res.status(500).send('Missing EBAY_VERIFICATION_TOKEN');
  }

  const endpoint =
    'https://ebay-deletion-endpoint-cml9.onrender.com/ebay/deletion';

  const hash = crypto
    .createHash('sha256')
    .update(challengeCode + verificationToken + endpoint)
    .digest('hex');

  return res.status(200).json({
    challengeResponse: hash
  });
});

// Start server (REQUIRED for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
