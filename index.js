const express = require('express');
const crypto = require('crypto');

const app = express();

app.use(express.json());

// Startup log
console.log("🚨 EBAY DELETION SERVICE RUNNING");

// Health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

// eBay endpoint (handles BOTH verification + notifications)
app.all('/ebay/deletion', (req, res) => {
  const challengeCode = req.query.challenge_code;

  // =========================
  // 1. CRC VERIFICATION FLOW
  // =========================
  if (challengeCode) {
    console.log("🔥 CRC VERIFICATION REQUEST RECEIVED");

    const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

    if (!verificationToken) {
      console.log("❌ Missing EBAY_VERIFICATION_TOKEN");
      return res.status(500).send('Missing EBAY_VERIFICATION_TOKEN');
    }

    const endpoint =
      'https://ebay-deletion-endpoint-cml9.onrender.com/ebay/deletion';

    const hash = crypto
      .createHash('sha256')
      .update(challengeCode + verificationToken + endpoint)
      .digest('hex');

    return res.json({
      challengeResponse: hash
    });
  }

  // =========================
  // 2. EVENT NOTIFICATION FLOW
  // =========================
  console.log("📩 EBAY EVENT RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  return res.status(200).send('OK');
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
