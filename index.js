const express = require('express');

const app = express();

app.use(express.json());

// STARTUP LOG (confirms correct deployment)
console.log("🚨 CATCH-ALL TEST SERVER RUNNING");

// CATCH-ALL ROUTE (logs EVERYTHING that hits your server)
app.use((req, res) => {
  console.log("🔥 REQUEST HIT:", req.method, req.url);
  res.send("OK - request received");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
