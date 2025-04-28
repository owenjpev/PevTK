// server/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/create-account', async (req, res) => {
    const { username, email } = req.body;
    try {
        const [result] = await pool.execute(
            `INSERT INTO users (username, email) VALUES (?, ?)`,
            [username, email]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Insert error:', err);
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
