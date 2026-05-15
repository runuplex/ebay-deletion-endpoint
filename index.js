const express = require('express');
const crypto = require('crypto');

const app = express();

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// eBay CRC endpoint
app.get('/ebay/deletion', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

  if (!verificationToken) {
    return res.status(500).send('Missing EBAY_VERIFICATION_TOKEN');
  }

  const endpoint = "https://ebay-deletion-endpoint-cml9.onrender.com/ebay/deletion";

  const hash = crypto
    .createHash('sha256')
    .update(challengeCode + verificationToken + endpoint)
    .digest('hex');

  return res.status(200).json({
    challengeResponse: hash
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
