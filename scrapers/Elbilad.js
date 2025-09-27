const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require ('cheerio')
const {transformDate} = require('./utils/dateHandling')
const exportingData = require('./utils/saveHandling')

// I need to make it so the user chooses a date and it will scrape until the date is due


const Datestr = "2025-09-26"
const userDate = new Date(Datestr) // i made the date on 2 seperate variables so i can refrence the str in the json file when saving

//let the user choose the news category
const categories = {
    national: "national",
    algeria: "derniere-info",
    economy: "economique",
    sports: "sports",
    observateur: "observateur",
    international: "international"
}



async function run(choosenDate, choosenCategory) {
    console.log(`Scraping the ${choosenCategory} category, until ${Datestr}`)
    let browser;
    let scrapedData = [];
    try {
        browser = await puppeteer.launch(
            // {headless:false} // <-- for debugging
        );
        console.log('Opening Browser ...')
        const page = await browser.newPage();
        
        // Make it skip loading images :
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image'].includes(req.resourceType())) {
                req.abort();
            } 
            else {
                req.continue();
            } // <-- reason is to make it faster and resource efficient
        });


        await page.goto(`https://www.elbilad.net/${choosenCategory}`)

        console.log('Accessing Elbilad ...')

        await page.waitForSelector('#categoryArticles > ul > li');

        console.log('Checking News ...')
        // makign a while loop to extract only news that's after the user's choosen date
        let keepGoing = true

        while (keepGoing){
            let articlCount = await page.$$eval(
                '#categoryArticles > ul > li',
                 articleNum => articleNum.length - 1) // to know the last article's number and use it as an id

            let extractLastDate = await page.$eval(
                `#categoryArticles > ul > li:nth-child(${articlCount}) > ul > li:nth-child(3)`,
                 date => date.textContent.trim())

            let stopDate = await transformDate(extractLastDate);

            if (choosenDate <= stopDate){
                await page.waitForSelector("#categoryArticles > ul > li.link-btn")
                await page.click("#categoryArticles > ul > li.link-btn")
                console.log('clicked the load more button...')
                await page.waitForFunction( // so it doesn't scrape until  it loads more news when the button is clicked
                    prevCount => {
                        return document.querySelectorAll("#categoryArticles > ul > li").length - 1 > prevCount
                    },
                    {timeout: 10000}, // no options
                    articlCount // <<--- this is passed as prevCount
                )
            } else {
                keepGoing = false
                let scraped = await page.$$eval('#categoryArticles > ul > li', news => news.map(
                (articl) =>{ 
                    const title = articl.querySelector('h3')?.textContent.trim() || ''
                    const link = articl.querySelector('h3 > a')?.href || ''
                    const date = articl.querySelector('ul > li:nth-child(3)')?.textContent.trim() || ''
                    return ({title,link,date})
                }
            ))
            for (let articl of scraped ){
                if (articl.link){
                            const response = await axios.get(articl.link)
                            const dateObj = await transformDate(articl.date) // makes the date a valid date
                            if(choosenDate <= dateObj){
                                if (response.status == 200){
                                    console.log('scraping content...')
                                    const html = await response.data
                                    const $ = cheerio.load(html)
                                    const contentData = $('.cols-a').find('p').text().replace("{{ key }}: {{ error[0] }}\n        بريدك الالكتروني\n        \n        اشتراك\n    10922 V 27500 7/8Satellite : Nilesat 7.0 ° West", "")
                                    const author = $('.title').find('.strong')?.text() || 'no author'
                                    scrapedData.push({
                                        'title': articl.title,
                                        'link': articl.link,
                                        'date': articl.date,
                                        'content': {
                                            'contentData':contentData,
                                            'author':author
                                        }
                                    })
                                }
                                else {
                                    throw new Error("Failed scraping the context")
                                }
                            }
                } else {
                    continue;
                }
            }
            }
        }
            await exportingData(`ElbiladData_${Datestr}_${choosenCategory}`, scrapedData)
    }
    catch (error){
        console.error(error)
    }
    finally{
        await browser.close();
    }
}
run(userDate, categories.national);
module.exports = {run, categories} // <-- so i can manage it in scraperManager