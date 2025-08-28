import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || "https://ytverifir-production.up.railway.app/oauth2callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Route to start OAuth login
app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.email"],
  });
  res.redirect(url); // Redirects user to Google login
});

// OAuth2 callback route
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Error: No code provided by Google!");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send("✅ Authentication successful!");
  } catch (err) {
    console.error("OAuth Error:", err);
    res.send("❌ Authentication failed. Check server logs.");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
