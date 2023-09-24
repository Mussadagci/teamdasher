const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const rateLimit = require("express-rate-limit");
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY || 'fallback_secret_key';

// Configure winston for logging
winston.configure({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'server.log' })
    ]
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
app.use(express.static(path.join(__dirname, '..' ,  'frontend')));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for users (replace with a database in a real-world scenario)
let users = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => { 
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', [
    check('username').isLength({ min: 5 }),
    check('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(200).json({ message: 'Registration successful' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});
app.use('/protected-route', verifyJWT, (req, res) => {
    // ... your route logic here
});

// Error handling middleware
app.use((err, req, res, next) => {
    winston.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.use((req, res) => {
    res.status(404).send('Page not found!');
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port and try again.`);
    } else {
        console.error('Failed to start server:', error);
    }
});
