const axios = require('axios'); 
const cheerio = require('cheerio');
const fs = require('fs')

const scrapedData = [];
const urls = ['https://www.ennaharonline.com/algeria/',
     'https://www.ennaharonline.com/algeria/page/2/',
      'https://www.ennaharonline.com/algeria/page/3/',
    'https://www.ennaharonline.com/algeria/page/4/',
    'https://www.ennaharonline.com/algeria/page/5/']
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
                const date = $(news).find('.card__mfit').text()
                if(date[0] >= '0' && date[0] <= '9'){
                scrapedData.push({
                    'title':header,
                    'date':date
                })
                }
            }
        }
    }
    fs.writeFile('EnnaharData', JSON.stringify(scrapedData),(err) =>{
        if (err) throw err;
        console.log('File saved')
    })
}
scrape();