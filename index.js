const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

// MENGATASI ERROR "Cannot GET /":
// Membaca file index.html dan file pendukung (css/gambar) di folder yang sama
app.use(express.static(__dirname));

// Routing untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API untuk WALA AI Storyboard
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/generate', async (req, res) => {
    try {
        const { topikUtama } = req.body;
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: `Buat storyboard untuk: ${topikUtama}` }],
            model: "llama-3.3-70b-versatile",
        });

        res.json({ success: true, data: chatCompletion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = app;