const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const crudRoutes = require('./crud');
require('dotenv').config();

const app = express();
connectDB();

// Middleware to parse JSON bodies
app.use(cors({
    origin: ['https://ticket.techvein.in/']
}));

// app.use(cors());
app.use(express.json({ extended: false }));

app.get("/", (req, res) => { res.send("Express on Vercel"); });

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', crudRoutes);

// Export the Express app instead of listening on a port
module.exports = app;
