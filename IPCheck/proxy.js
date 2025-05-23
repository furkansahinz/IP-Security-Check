const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept']
}));


app.use(express.static(path.join(__dirname)));

// AbuseIPDB API KEY
const API_KEY = 'API_KEY'; // AbuseIPDB's API KEY


app.get('/test', (req, res) => {
    console.log('Test endpoint called');
    res.json({ message: 'Proxy server is working!' });
});


app.get('/check-ip/:ip', async (req, res) => {
    try {
        console.log('Checking IP:', req.params.ip);

        const response = await axios.get(`https://api.abuseipdb.com/api/v2/check`, {
            params: {
                ipAddress: req.params.ip,
                maxAgeInDays: 90
            },
            headers: {
                'Accept': 'application/json',
                'Key': API_KEY
            }
        });

        console.log('API Response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('API Error:', error.message);
        console.error('Error Details:', error.response ? error.response.data : 'No additional details');
        
        let errorMessage = 'API bağlantısında bir sorun oluştu';
        let errorDetails = error.message;

        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = 'API anahtarı geçersiz';
                errorDetails = 'Lütfen geçerli bir AbuseIPDB API anahtarı kullanın';
            } else if (error.response.status === 429) {
                errorMessage = 'API istek limiti aşıldı';
                errorDetails = 'Lütfen bir süre bekleyip tekrar deneyin';
            }
        }

        res.status(500).json({ 
            error: errorMessage,
            details: errorDetails,
            apiResponse: error.response ? error.response.data : null
        });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
    console.log(`Test the server at: http://localhost:${PORT}/test`);
    console.log(`Access the application at: http://localhost:${PORT}/test.html`);
}); 
