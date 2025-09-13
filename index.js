const axios = require('axios'); 
const cheerio = require('cheerio');
const { error } = require('console');
const fs = require('fs')

const scrapedData = [];
const pages = 1; // number of pages i want to scrape
const urls = []
for (let i = 1;i<=pages;i++){
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
                const link = $(news).find('.bunh').attr('href') // lets scrape this page too
                const pageContent = await axios.get(link)
                const $1 = cheerio.load(pageContent.data)
                const author = ($1('.sgb1__amta').find('[href="#"]').text()).replace("\n\t\t\t\t\t\t\t\t\t\t\t", "")
                const content = $1('.artx').find('p').text()
                if(date){
                scrapedData.push({
                    'title':header,
                    'date':date,
                    'link':link,
                    'content':{
                        'author':author,
                        'content':content
                    }
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