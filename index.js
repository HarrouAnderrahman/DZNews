const axios = require('axios'); 
const cheerio = require('cheerio');
const fs = require('fs')

const scrapedData = [];
const pages = 3;
const urls = []
for (i = 0;i<pages;i++){
    let page = `https://www.ennaharonline.com/algeria/page/${i}/`
    urls.push(page)
}
async function scrape() {
    for (const url of urls){
        const response = await axios.get(url)
        if (response.status == 200){
            console.log(`scraping : ${url}`)
            const html = response.data
            const $ = cheerio.load(html)
            const totalNews = $('.card__meta')
            for (const news of totalNews ){
                const header = $(news).find('.bunh').text()
                const date = $(news).find('.card__mfit').attr('datetime')
                if(date){
                scrapedData.push({
                    'title':header,
                    'date':date
                })
                }
            }
        }
    }
    fs.writeFile('EnnaharData.json', JSON.stringify(scrapedData),(err) =>{
        if (err) throw err;
        console.log('File saved')
    })
}
scrape();