const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware для обробки JSON і форм
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Головна сторінка
app.get('/', (req, res) => {
    res.send(`
        <form method="POST" action="/weather">
            <label for="city">Enter City:</label>
            <input type="text" id="city" name="city" required>
            <button type="submit">Get Weather</button>
        </form>
    `);
});

// Обробка запиту на погоду
app.post('/weather', async (req, res) => {
    const city = req.body.city;
    const url = `https://www.google.com/search?q=weather+${encodeURIComponent(city)}`;

    try {
        // Отримання HTML-сторінки з Google Weather
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Парсинг HTML за допомогою Cheerio
        const $ = cheerio.load(data);
        const location = $('#wob_loc').text();
        const time = $('#wob_dts').text();
        const temperature = $('#wob_tm').text();
        const condition = $('#wob_dc').text();

        if (location && time && temperature && condition) {
            res.json({
                location,
                time,
                temperature: `${temperature}°C`,
                condition
            });
        } else {
            res.status(404).json({ error: 'Weather information not found. Please check the city name.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data from Google.' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});