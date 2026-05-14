const express = require('express');
const crypto = require('crypto');

const app = express();

app.use(express.json());

const endpoint =
  'https://YOUR-RENDER-APP.onrender.com/ebay/deletion';

app.get('/', (req, res) => {
  res.send('running');
});

app.post('/ebay/deletion', (req, res) => {
  const challengeCode = req.body.challengeCode;

  if (!challengeCode) {
    return res.status(400).send('Missing challengeCode');
  }

  const verificationToken =
    process.env.EBAY_VERIFICATION_TOKEN;

  const hash = crypto
    .createHash('sha256')
    .update(
      challengeCode + verificationToken + endpoint
    )
    .digest('hex');

  return res.status(200).json({
    challengeResponse: hash
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
