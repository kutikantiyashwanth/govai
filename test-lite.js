
const axios = require('axios');
const cheerio = require('cheerio');
const { URLSearchParams } = require('url');

async function testLite() {
    console.log("Testing DuckDuckGo Lite...");
    try {
        const url = "https://lite.duckduckgo.com/lite/";
        // POST request usually works for Lite
        const form = new URLSearchParams();
        form.append('q', 'current railway jobs india official');

        const res = await axios.post(url, form.toString(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://lite.duckduckgo.com',
                'Referer': 'https://lite.duckduckgo.com/'
            }
        });

        console.log("Status:", res.status);
        const $ = cheerio.load(res.data);

        const results = [];
        $('.result-link').each((i, el) => {
            if (i < 5) {
                const title = $(el).text();
                const link = $(el).attr('href');
                results.push({ title, link });
            }
        });

        console.log("Results found:", results.length);
        console.log(results);
    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) console.error("Status:", e.response.status);
    }
}

testLite();
