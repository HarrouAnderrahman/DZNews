const axios = require('axios'); 
const cheerio = require('cheerio');
const exportingData = require('./utils/saveHandling')
const {dateToString} = require('./utils/dateHandling')



const scrapedData = [];



const categories ={ // mapped the categories so i can make better ux by making universal syntax for all categories
    algeria: "algeria",
    economics: "economy",
    sports: "sport",
    international: "world",
}

const axiosHeader = { // to make it not look like a bot :]
    headers:{
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
    }
}


async function run(choosenDate, choosenCategory, saveOption) {
    try {
        const dateStr = await dateToString(choosenDate)
        // console.log(`choosendate : ${choosenDate} , ${typeof choosenDate}`) <-- debugging
        console.log(`Scraping the ${choosenCategory} category, until ${dateStr}`)
        let keepGoing = true
        let i = 1
        while(keepGoing){
            let page = `https://www.echoroukonline.com/${choosenCategory}/page/${i}/`
            const response = await axios.get(page, axiosHeader)
            if (response.status == 200){
                console.log(`scraping : ${page}`)
                const html = response.data // cummon cheerio+axios scraping technique , doesnt need explaining
                const $ = cheerio.load(html)
                const totalNews = $('.ech-card__meta.fx-1._border._row._x-middle')
                let n = 0

                for (const news of totalNews ){
                    const header = $(news).find('h3').text().replace(/\s+/g, ' ')
                    const date = $(news).find('.ech-card__mtil').text()
                    const link = $(news).find('h3 > a').attr('href') // lets scrape this page too

                    const pageContent = await axios.get(link, axiosHeader) // scraping each articl link using the same technique of scraping the whole articles page
                    const $1 = cheerio.load(pageContent.data)
                    let author = $1(".d-f.fxd-c.ai-fs").find('a.ech-sgmn__aanm._link').text()
                    if(!author) {author = $1(".d-f.fxd-c.ai-fs").find('.ech-sgmn__aanm._noap').text()} // for sports category
                    const content = $1('.ech-artx').find('p').text()
                    // console.log(`card date : ${date}`) <-- debugging
                    if(date){
                        let dateObj = new Date (date)
                        // console.log(`dateOBJ : ${dateObj}`) <-- debugging
                        // console.log(`choosenDate : ${choosenDate}`) <-- debugging
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
        await exportingData(`EchouroukData_${dateStr}_${choosenCategory}`, scrapedData, saveOption)
    } catch (error) {
        console.error(error)
    }
}
// const chdate = new Date("2025/10/02")
// run(chdate, "world", "csv");
module.exports = {run, categories} // <-- so i can manage it in scraperManager