const express = require("express");
const fetch = require("node-fetch");
const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 3000;

const APP_KEY = process.env.SINRIC_APP_KEY;
const DEVICE_ID = process.env.SINRIC_DEVICE_ID;

app.get("/", (req, res) => {
  res.send("Adhaan Automation Server Running");
});

// Function to turn switch ON
async function triggerAdhaan() {
  try {
    await fetch(`https://api.sinric.pro/api/v1/devices/${DEVICE_ID}/actions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${APP_KEY}`
      },
      body: JSON.stringify({
        type: "action.devices.commands.OnOff",
        state: { on: true }
      })
    });

    console.log("Adhaan Trigger Sent");
  } catch (error) {
    console.error("Error triggering Sinric:", error);
  }
}

// Fetch prayer times
async function getPrayerTimes() {
  try {
    const response = await fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Puttur&country=India&method=1"
    );
    const data = await response.json();
    const fajrTime = data.data.timings.Fajr;

    console.log("Today's Fajr:", fajrTime);

    const [hour, minute] = fajrTime.split(":");

    cron.schedule(`${minute} ${hour} * * *`, () => {
      triggerAdhaan();
    });

  } catch (error) {
    console.error("Error fetching prayer times:", error);
  }
}

// Run daily at midnight to reschedule
cron.schedule("0 0 * * *", () => {
  getPrayerTimes();
});

getPrayerTimes();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
