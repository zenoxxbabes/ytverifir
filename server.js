import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 5000;

// ⚡ Credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Step 1 - Login redirect
app.get("/login", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube.readonly"]
  });
  res.redirect(url);
});

// Step 2 - Callback
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.send(`
      <html>
        <head><title>YT Verification</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 100px;">
          <h1>✅ Verification Successful!</h1>
          <p>You can close this window now.</p>
        </body>
      </html>
    `);
  } catch (err) {
    res.send(`
      <html>
        <head><title>YT Verification</title></head>
        <body style="font-family: Arial; text-align: center; margin-top: 100px; color: red;">
          <h1>❌ Error during verification</h1>
          <p>${err.message}</p>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
