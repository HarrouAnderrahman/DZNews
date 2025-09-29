const axios = require('axios'); 
const cheerio = require('cheerio');
const exportingData = require('./utils/saveHandling')
const {dateToString} = require('./utils/dateHandling')



const scrapedData = [];

// const Datestr = "2025-09-27" // <-- for debugging
// const userDate = new Date(Datestr) 

//let the user choose the news category
const categories ={ // mapped the categories so i can make better ux by making universal syntax for all categories
    algeria: "algeria",
    national: "national",
    sports: "sport",
    international: "world",
    culture: "culture",
    society: "society"
}


async function run(choosenDate, choosenCategory, saveOption) {
    try {
        const dateStr = await dateToString(choosenDate)
        console.log(`Scraping the ${choosenCategory} category, until ${dateStr}`)
        let keepGoing = true
        let i = 1
        while(keepGoing){
            let page = `https://www.ennaharonline.com/${choosenCategory}/page/${i}/`
            const response = await axios.get(page)
            if (response.status == 200){
                console.log(`scraping : ${page}`)
                const html = response.data // cummon cheerio+axios scraping technique , doesnt need explaining
                const $ = cheerio.load(html)
                const totalNews = $('.card__meta')
                let n = 0

                for (const news of totalNews ){
                    const header = $(news).find('.bunh').text()
                    const date = $(news).find('.card__mfit').attr('datetime')
                    const link = $(news).find('.bunh').attr('href') // lets scrape this page too

                    const pageContent = await axios.get(link) // scraping each articl link using the same technique of scraping the whole articles page
                    const $1 = cheerio.load(pageContent.data)
                    const author = ($1('.sgb1__amta').find('[href="#"]').text()).replace("\n\t\t\t\t\t\t\t\t\t\t\t", "")
                    const content = $1('.artx').find('p').text()
                    if(date){
                        dateObj = new Date (date)
                        if(choosenDate < dateObj){
                            n += 1;
                            console.log(`Scraping article ${n}...`)
                            scrapedData.push({
                                'title':header,
                                'date':date,
                                'link':link,
                                'content':{
                                    'author':author,
                                    'content':content
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
        await exportingData(`EnnaharData_${dateStr}_${choosenCategory}`, scrapedData, saveOption)
    } catch (error) {
        console.error(error)
    }
}
// run(userDate ,categories.sports); // <-- for debugging
module.exports = {run, categories} // <-- so i can manage it in scraperManager