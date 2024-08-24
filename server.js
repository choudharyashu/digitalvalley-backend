// server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const crudRoutes = require('./crud');
require('dotenv').config();

const app = express();
connectDB();

// Middleware to parse JSON bodies
app.use(cors(
    {
        origin: ['https://ticket.techvein.in/']
    }
));
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', crudRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
