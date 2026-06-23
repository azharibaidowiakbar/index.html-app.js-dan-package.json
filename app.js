const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Pastikan file html ada di folder 'public'

// API Key diambil dari Environment Variable (Setting di Vercel)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/generate', async (req, res) => {
    try {
        const { topikUtama, jumlahScene, durasi, targetAudiens, gayaVisual } = req.body;
        
        const prompt = `Buat storyboard mendetail untuk topik: "${topikUtama}".
        Rincian:
        - Jumlah Scene: ${jumlahScene}
        - Durasi Total: ${durasi}
        - Target Audiens: ${targetAudiens}
        - Gaya Visual: ${gayaVisual}
        Tuliskan deskripsi visual dan narasi/dialog untuk setiap scene secara terpisah dan terstruktur.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
        });

        res.json({ success: true, data: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error("Error Detail:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// PENTING: Jangan gunakan app.listen(5000)
// Ekspor app agar Vercel bisa menjalankan servernya
module.exports = app;