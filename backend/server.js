const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.NEWSAPI_KEY;

app.use(express.static('public'));

app.get('/news', async (req, res) => {
    const { query, page, category } = req.query;
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&page=${page}&category=${category}&apiKey=${apiKey}&q=${query}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
