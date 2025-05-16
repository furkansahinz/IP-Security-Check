const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies and text
app.use(express.json());
app.use(express.text());
app.use(express.static('.'));

// API key for AbuseIPDB
const API_KEY = '891f0caea9b384021db3677ed0a57f8bb36ed7a0da16a222a448678160f926461678221b436aab30'; // Replace with your actual API key

// Endpoint to check IP
app.get('/check-ip/:ip', async (req, res) => {
    try {
        const ip = req.params.ip;
        const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
            headers: {
                'Key': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`AbuseIPDB API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error checking IP:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get whitelist
app.get('/whitelist.txt', async (req, res) => {
    try {
        const data = await fs.readFile('whitelist.txt', 'utf8');
        res.type('text/plain').send(data);
    } catch (error) {
        console.error('Error reading whitelist:', error);
        res.status(500).send('Error reading whitelist');
    }
});

// Endpoint to update whitelist
app.put('/whitelist.txt', async (req, res) => {
    try {
        const content = req.body;
        console.log('Received content:', content); // Debug log
        await fs.writeFile('whitelist.txt', content, 'utf8');
        res.send('Whitelist updated successfully');
    } catch (error) {
        console.error('Error updating whitelist:', error);
        res.status(500).send('Error updating whitelist');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 