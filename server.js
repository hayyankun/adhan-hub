const express = require("express");
const fetch = require("node-fetch");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

// Basic route
app.get("/", (req, res) => {
  res.send("Adhaan Automation Server Running");
});

// Function to fetch prayer times for Puttur
async function getPrayerTimes() {
  try {
    const response = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Puttur&country=India&method=1"
    );
    const data = await response.json();
    const timings = data.data.timings;

    console.log("Today's Prayer Times:");
    console.log(timings);

    // Later we will trigger Alexa here

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
