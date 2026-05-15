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

  console.log("CHALLENGE:", challengeCode);
  console.log("TOKEN EXISTS:", !!verificationToken);
  console.log("ENDPOINT:", endpoint);

  const hash = crypto
    .createHash('sha256')
    .update(challengeCode + verificationToken + endpoint)
    .digest('hex');

  console.log("HASH:", hash);

  return res.status(200).json({
    challengeResponse: hash
  });
});
