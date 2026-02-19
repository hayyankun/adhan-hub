const express = require("express");
const fetch = require("node-fetch");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.send("Adhaan Automation Server Running");
});

/*
 SIMPLE OAUTH MOCK (for Alexa Account Linking)
*/

// Authorization endpoint
app.get("/auth", (req, res) => {
  const state = req.query.state;

  const redirectUri = "https://pitangui.amazon.com/api/skill/link/M10BWP3MP65WLC";

  res.redirect(`${redirectUri}?code=AUTH_CODE&state=${state}`);
});


// Token endpoint
app.post("/token", (req, res) => {
  res.json({
    access_token: "ACCESS_TOKEN",
    token_type: "Bearer",
    expires_in: 3600,
    refresh_token: "REFRESH_TOKEN"
  });
});

// Fetch prayer times
async function getPrayerTimes() {
  try {
    const response = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Puttur&country=India&method=1"
    );
    const data = await response.json();
    const timings = data.data.timings;

    console.log("Today's Prayer Times:");
    console.log(timings);

  } catch (error) {
    console.error("Error fetching prayer times:", error);
  }
}

// Run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Fetching new prayer times...");
  getPrayerTimes();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

