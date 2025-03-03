require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "Message is required" });

    try {
        const response = await axios.post(`${API_URL}?key=${process.env.API_KEY}`, {
            message: userMessage
            // Adjust the payload based on the API requirements
        });

        res.json({ response: response.data.response });
    } catch (error) {
        console.error("Error fetching AI response:", error);
        res.status(500).json({ error: "Failed to process the message" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
