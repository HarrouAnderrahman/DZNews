const fs = require('fs')
const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require ('cheerio')

// I need to make it so the user chooses a date and it will scrape until the date is due
const userDate = new Date('2025-09-15')
// first lemme just make a function that transform the articl date to a valid js date
async function transformDate(str) {
    let [stopDay, stopMonth, stopYear] = str.split('-')
    return new Date(`${stopYear}-${stopMonth}-${stopDay}`)
}
async function run(choosenDate) {
    let browser;
    let scrapedData = [];
    try {
        browser = await puppeteer.launch({headless:false});
        console.log('Opening Browser ...')
        const page = await browser.newPage();
        // The reason i commented this is because it was hiding the button
        // await page.setRequestInterception(true);
        // page.on('request', (req) => {
        //     if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        //         req.abort();
        //     } 
        //     else {
        //         req.continue();
        //     }
        // });
        await page.goto('https://www.elbilad.net/national')
        console.log('Accessing Elbilad ...')
        await page.waitForSelector('#categoryArticles > ul > li');
        console.log('Checking News ...')
        // makign a while loop to extract only news that's after the user's choosen date
        let keepGoing = true
        while (keepGoing){
            let articlCount = await page.$$eval(
                '#categoryArticles > ul > li',
                 articleNum => articleNum.length - 1)
            let extractLastDate = await page.$eval(
                `#categoryArticles > ul > li:nth-child(${articlCount}) > ul > li:nth-child(3)`,
                 date => date.textContent.trim())
            let stopDate = await transformDate(extractLastDate);
            if (choosenDate < stopDate){
                await page.waitForSelector("#categoryArticles > ul > li.link-btn")
                await page.click("#categoryArticles > ul > li.link-btn")
                console.log('clicked the load more button...')
                await page.waitForFunction(
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
                } else {
                    continue;
                }
            }
            }
        }
            await fs.writeFile('ElbiladData.json', JSON.stringify(scrapedData),(err)=>{
            if (err) throw err
            console.log('File Saved!')
        })
    }
    catch (error){
        console.error(error)
    }
    finally{
        await browser.close();
    }
}
run(userDate);