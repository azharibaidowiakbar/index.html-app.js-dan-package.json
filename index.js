const express = require('express');
const Groq = require('groq-sdk');
const app = express();
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/generate', async (req, res) => {
    try {
        const chat = await groq.chat.completions.create({
            messages: [{ role: "user", content: `Buat storyboard untuk: ${req.body.topikUtama}` }],
            model: "llama-3.3-70b-versatile",
        });
        res.json({ success: true, data: chat.choices[0].message.content });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = app;