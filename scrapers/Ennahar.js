const axios = require('axios'); 
const cheerio = require('cheerio');
const exportingData = require('./utils/saveHandling')



const scrapedData = [];

const Datestr = "2025-09-27" // <-- for debugging
const userDate = new Date(Datestr) // i made the date on 2 seperate variables so i can refrence the str in the json file when saving

//let the user choose the news category
const categories ={ // mapped the categories so i can make better ux by making universal syntax for all categories
    algeria: "algeria",
    national: "national",
    sports: "sport",
    international: "world",
    culture: "culture",
    society: "society"
}


async function run(choosenDate, choosenCategory) {
    try {
        console.log(`Scraping the ${choosenCategory} category, until ${Datestr}`)
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
    } catch (error) {
        console.error(error)
    }
    await exportingData(`EnnaharData_${Datestr}_${choosenCategory}`, scrapedData)
}
run(userDate ,categories.sports);
module.exports = {run, categories} // <-- so i can manage it in scraperManager