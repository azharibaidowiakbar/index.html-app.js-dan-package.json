const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Vercel akan membaca process.env.GROQ_API_KEY dari dashboard Anda
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