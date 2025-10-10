const axios = require('axios'); 
const cheerio = require('cheerio');
const exportingData = require('./utils/saveHandling')
const {dateToString} = require('./utils/dateHandling')


const  categories = {
    national: "national",
    sports: "sport",
    international: "world",
    politics: "politique",
    security: "securite",
    economy: "economie",
}


const axiosHeader = { // to make it not look like a bot :]
    headers:{
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
    }
}


async function run(choosenDate, choosenCategory, saveOption) {
    try {
        let scrapedData = []
        const dateStr = await dateToString(choosenDate)
        console.log(`Scraping the ${choosenCategory} category, until ${dateStr}`)
        let keepGoing = true
        let i = 1
        while(keepGoing){
            let page = `https://www.dzair-tube.dz/${choosenCategory}/page/${i}/`
            const response = await axios.get(page, axiosHeader)
            if (response.status == 200){
                console.log(`scraping : ${page}`)
                const html = response.data // cummon cheerio+axios scraping technique , doesnt need explaining
                const $ = cheerio.load(html)
                const totalNews = $('.post-card')
                let n = 0

                for (const news of totalNews ){
                    const header = $(news).find('h2').text()
                    const date = $(news).find('.article-date').attr('datetime')
                    const link = $(news).find('h2 > a').attr('href') // lets scrape this page too

                    const pageContent = await axios.get(link, axiosHeader) // scraping each articl link using the same technique of scraping the whole articles page
                    const $1 = cheerio.load(pageContent.data)
                    const author = $1('.single-author').find('span').text()
                    const content = $1('.single-content.entry-content').find('p').text()
                    if(date){ // to diffrentiate from side cards
                        let dateObj = new Date (date)
                        if(choosenDate <= dateObj){
                            n += 1;
                            console.log(`Scraping article ${n}...`)
                            scrapedData.push({
                                'title':header,
                                'date':date,
                                'link':link,
                                'content':{
                                    'author':author,
                                    'contentData':content
                                }
                            })
                        }else{
                            keepGoing = false
                            console.log("Reached the end date")
                            break;
                        }
                    }
                }
                if(keepGoing) i++; //scrape next url
            } 
            else {
                keepGoing = false
                throw new Error("Coudln't load the Page , response.status != 200")
            }

        }
        await exportingData(`DZ-Tube_${dateStr}_${choosenCategory}`, scrapedData, saveOption)
    } catch (error) {
        console.error(error)
    }
}
const date = new Date ("10-08-2025")
run(date, "national", "csv")
module.exports = {run, categories} // <-- so i can manage it in scraperManager