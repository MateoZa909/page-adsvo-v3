import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const port = 3000;

const apiKey = '8fc6900bb6bd4b6197f389a0e186b130';
const newsApiUrl = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=' + apiKey;

app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get(newsApiUrl);
        const articles = response.data.articles;

        const detailedArticles = await Promise.all(articles.map(async article => {
            const fullContent = await getFullContent(article.url);
            return {
                ...article,
                fullContent
            };
        }));

        res.json(detailedArticles);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Error fetching news');
    }
});

async function getFullContent(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        return $('article').text();  // Ajusta el selector según la estructura de la página
    } catch (error) {
        console.error('Error scraping content:', error);
        return 'Contenido completo no disponible';
    }
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
