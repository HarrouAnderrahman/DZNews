const fs = require('fs')
const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require ('cheerio')
const exportingData = require('./utils/saveHandling')
const {dateToString} = require('./utils/dateHandling')

// I need to make it so the user chooses a date and it will scrape until the date is due

// const dateStr = "2025-09-18" // <-- for debugging
// const userDate = new Date(dateStr) 
// i made the date on 2 seperate variables so i can refrence the str in the json file when saving


// why not let the user choose the news category
const categories ={
    national: "الحدث",
    politics: "سياسة",
    economics: "اقتصاد",
    society: "مجتمع",
    culture: "ثقافة-و-فن",
    sports: "رياضة",
    international: "دولي"
}

// first lemme just make a function that transform the articl date to a valid js date
// i dont need to make this function for this site since it gives a valid date

async function run(choosenDate, choosenCategory, saveOption) {
    const dateStr = await dateToString(choosendate)
    console.log(`Scraping the ${choosenCategory} category, until ${dateStr}`)
    let browser;
    let scrapedData = [];
    try {
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
                            const response = await axios.get(articl.link)
                            const dateObj = new Date(articl.date) // so i can compare it
                            // The issue: the scraper is scraping every link including the ones that passed the choosenDate and i need to fix that
                            if (choosenDate < dateObj){
                                if (response.status == 200){
                                    console.log('scraping content...')
                                    const html = await response.data
                                    const $ = cheerio.load(html)
                                    const contentData = $('.article__txt').text().replace("\n\t\t\t\t\t\t\t\t", "")
                                    const author = $('.article__author-name')?.text() || 'no author'
                                    scrapedData.push({
                                        'title': articl.title,
                                        'link': articl.link,
                                        'date': dateObj,
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
// run(userDate, categories.national) // <-- for debugging
module.exports = {run, categories} // <-- so i can manage it in scraperManager