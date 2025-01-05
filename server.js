// server.js
const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static("public"));

// A simple endpoint to fetch weather data
app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
      return res.status(400).json({ error: "Please provide a city" });
    }
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "No API key found. Please set OPENWEATHER_API_KEY" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching weather data" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

