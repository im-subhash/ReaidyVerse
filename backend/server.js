const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Create uploads directory if not exists
const fs = require('fs');
const path = require('path');
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
    console.log('Created uploads directory');
}

// Database Connection
// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-clone')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
    res.send('Instagram Clone API is running');
});

app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong', timestamp: new Date() });
});

const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler (Log if we hit this)
app.use((req, res, next) => {
    console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(500).json({ message: err.message || "Server Error", error: err });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
