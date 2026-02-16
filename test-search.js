
const axios = require('axios');
const cheerio = require('cheerio');

async function testSearch(query) {
    console.log(`Searching for: ${query}`);
    try {
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + " india government official site")}`;
        const response = await axios.get(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        const $ = cheerio.load(response.data);
        const results = [];
        $(".result").each((i, el) => {
            if (i < 5) {
                const title = $(el).find(".result__a").text().trim();
                const link = $(el).find(".result__a").attr("href");
                if (title && link) results.push({ title, link });
            }
        });
        console.log("Results found:", results.length);
        console.log(results);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testSearch("latest railway jobs");
