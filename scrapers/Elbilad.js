const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require ('cheerio')
const {transformDate, dateToString} = require('./utils/dateHandling')
const exportingData = require('./utils/saveHandling')


const axiosHeader = { // to make it not look like a bot :]
    headers:{
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
    }
}

const categories = {
    national: "national",
    algeria: "derniere-info",
    economy: "economique",
    sports: "sports",
    observateur: "observateur",
    international: "international"
}



async function run(choosenDate, choosenCategory, saveOption) {
    const dateStr = await dateToString(choosenDate)
    console.log(`Scraping the ${choosenCategory} category, until ${dateStr}`)
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
                    {timeout: 10000},
                    articlCount // <<--- this is passed as prevCount
                )
            } 
            else {
                keepGoing = false
                // My dumb ahh forgot to make it scrape the main (big card) too
                let mainArticl = await page.$eval('#content > header > ul > li > h1 > a', (mainArticl)=>{
                    const title = mainArticl.textContent.trim();
                    const link = mainArticl.href;
                    const date = ''
                    return ({title, link, date})
                })

                // normal Cards :

                let articles = await page.$$eval('#categoryArticles > ul > li', news => news.map(
                (articl) =>{ 
                    const title = articl.querySelector('h3')?.textContent.trim() || ''
                    const link = articl.querySelector('h3 > a')?.href || ''
                    const date = articl.querySelector('ul > li:nth-child(3)')?.textContent.trim() || ''
                    return ({title,link,date})
                }
                ))
                articles.unshift(mainArticl)
                for (let articl of articles ){
                    if (articl.link){
                                const response = await axios.get(articl.link, axiosHeader)
                                if (!articl.date) {
                                    const mainHtml = await response.data
                                    const main$ = cheerio.load(mainHtml)
                                    articl.date = main$('#content > header > ul.list-share > li.title > a > span:nth-child(2)').text().trim().slice(0, 10)
                                }
                                const dateObj = await transformDate(articl.date) // makes the date a valid date
                                if(choosenDate <= dateObj){
                                    if (response.status == 200){
                                        console.log('scraping content...')
                                        const html = await response.data
                                        const $ = cheerio.load(html)
                                        const contentData = $('.cols-a').find('p').text().replace("{{ key }}: {{ error[0] }}\n        بريدك الالكتروني\n        \n        اشتراك\n    10922 V 27500 7/8Satellite : Nilesat 7.0 ° West", "")
                                        const author = $('.title').find('.strong')?.text() || 'Unknown author'
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
            await exportingData(`ElbiladData_${dateStr}_${choosenCategory}`, scrapedData, saveOption)
    }
    catch (error){
        console.error(error)
    }
    finally{
        await browser.close();
    }
}
// run(userDate, categories.national); // <-- for debugging
module.exports = {run, categories} // <-- so i can manage it in scraperManager