import express from "express";
import { google } from "googleapis";

const app = express();
const port = process.env.PORT || 5000;

// ⚡ Yaha apne Google Cloud credentials daalo
const CLIENT_ID = "461360521840-nc4rac2qoea5udk1l96ndclli112s9hf.apps.googleusercontent.com"; 
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://your-backend-service.onrender.com/oauth2callback"; 

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

// Step 2 - Callback (Google calls this after login)
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
