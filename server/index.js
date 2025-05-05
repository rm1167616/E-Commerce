// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // React app URL
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Sample route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Import your routes
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);
const db = require('./database/connection');

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
