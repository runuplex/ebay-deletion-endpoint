const express = require('express');
const crypto = require('crypto');

const app = express();

app.use(express.json());

// Simple health check (optional but useful for Render)
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// eBay Account Deletion / CRC endpoint
app.get('/ebay/deletion', (req, res) => {
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(400).send('Missing challenge_code');
  }

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

  if (!verificationToken) {
    return res.status(500).send('Missing EBAY_VERIFICATION_TOKEN');
  }

  // IMPORTANT: must match EXACT public URL eBay calls
  const endpoint = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;

  const hash = crypto
    .createHash('sha256')
    .update(challengeCode + verificationToken + endpoint)
    .digest('hex');

  return res.status(200).json({
    challengeResponse: hash
  });
});

// Start server (required for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
