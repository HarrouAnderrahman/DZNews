const fs = require('fs')
const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require ('cheerio')
const exportingData = require('./utils/saveHandling')
const {dateToString} = require('./utils/dateHandling')
const axiosHeader = require('./utils/axiosHeader')


const categories ={ // easier and more efficient to list categories this way
    national: "الحدث",
    politics: "سياسة",
    economics: "اقتصاد",
    society: "مجتمع",
    culture: "ثقافة-و-فن",
    sports: "رياضة",
    international: "دولي"
}


async function run(choosenDate, choosenCategory, saveOption) { // same as Elbilad scraper with some changes
    try {
        let scrapedData = [];
        let browser;
        const dateStr = await dateToString(choosenDate)
        console.log(`Scraping the ${choosenCategory} category, until ${dateStr}`)
        browser = await puppeteer.launch(
            // {headless:false} // <-- For debugging
        );
        console.log('Opening Browser ...')

        const page = await browser.newPage();

        // making the scraper skipping images
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image'].includes(req.resourceType())) {
                req.abort();
            } 
            else {
                req.continue();
            }
        }); // <-- The reason is to make it load faster

        await page.goto(`https://algeriemaintenant.dz/category/${choosenCategory}/`)

        console.log('Accessing Algeriemaintenant ...')

        await page.waitForSelector("body > div.arcv > div > div > div.arcv__main > div > div.arcv__ccar"); // waiting for the news to load so it doesn't mess up
        console.log('Checking News ...')
        // makign a while loop to extract only news that's after the user's choosen date
        let keepGoing = true

        while (keepGoing){
            let articlCount = await page.$$eval(
                "body > div.arcv > div > div > div.arcv__main > div > div.arcv__ccar > article.art1",
                 articleNum => articleNum.length + 1) 
            // console.log(`Loaded articles : ${articlCount}`) // <-- For debugging
            let extractLastDate = await page.$eval(
                `body > div.arcv > div > div > div.arcv__main > div > div.arcv__ccar > article:nth-child(${articlCount}) > div > div.datl.d-f > time`,
                 date => date.dateTime) // the date is valid so it doesnt need any date manipulation

            // console.log(`Last loaded date : ${extractLastDate}`) // <-- For debugging

            let stopDate = new Date(extractLastDate)

            if (choosenDate <= stopDate){
                await page.waitForSelector("#lda_request") // the button id

                await page.click("#lda_request")

                console.log('clicked the load more button...')

                await page.waitForFunction( // this code will wait for other articles to load after pressing the button
                    prevCount => {
                        return document.querySelectorAll("body > div.arcv > div > div > div.arcv__main > div > div.arcv__ccar > article.art1").length + 1 > prevCount
                    },
                    {timeout: 10000},
                    articlCount // <<--- this is passed as prevCount
                )
            } else {
                keepGoing = false // after we make sure the needed news are scraped we can start scraping
                let scraped = await page.$$eval('body > div.arcv > div > div > div.arcv__main > div > div.arcv__ccar > article.art1', news => news.map(
                (articl) =>{ 
                    const title = articl.querySelector('h2')?.textContent.trim() || ''
                    const link = articl.querySelector('h2 > a')?.href || ''
                    const date = articl.querySelector("div > div.datl.d-f > time")?.dateTime || ''
                    return ({title,link,date})
                }
            ))
            for (let articl of scraped ){
                if (articl.link){ 
                            const response = await axios.get(articl.link, axiosHeader)
                            const dateObj = new Date(articl.date) // so i can compare it
                            // The issue: the scraper is scraping every link including the ones that passed the choosenDate and i need to fix that
                            if (choosenDate < dateObj){
                                if (response.status == 200){
                                    console.log('scraping content...')
                                    const html = await response.data
                                    const $ = cheerio.load(html)
                                    const contentData = $('.article__txt').text().replace("\n\t\t\t\t\t\t\t\t", "")
                                    let author = $('.article__author-name').text().replace("بواسطة", "")
                                    if (author.trim() == false) {author = "Unknown author"} // for more organized look
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
            await exportingData(`AlgeriemaintenantData_${dateStr}_${choosenCategory}`, scrapedData, saveOption)
    }
    catch (error){
        console.error(error)
    }
    finally{
        await browser.close();
    }
}
module.exports = {run, categories} // <-- so i can manage it in scraperManager