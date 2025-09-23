const { error } = require('console');
const fs = require('fs')
const puppeteer = require('puppeteer')
const axios = require('axios')
const cheerio = require ('cheerio')

async function run() {
    let browser;
    let scrapedData = [];
    try {
        browser = await puppeteer.launch();
        console.log('Opening Browser ...')
        const page = await browser.newPage();
        await page.setRequestInterception(true);// make it skip loading the unnecessary things to make the loading faster
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.abort();
            } 
            else {
                req.continue();
            }
        });
        await page.goto('https://www.elbilad.net/national')
        console.log('Accessing Elbilad ...')
        await page.waitForSelector('#categoryArticles > ul > li');
        console.log('Extracting News ...')
        let scraped = await page.$$eval('#categoryArticles > ul > li', news => news.map(
        (articl) =>{ 
                const title = articl.querySelector('h3')?.textContent.trim() || ''
                const link = articl.querySelector('h3 > a')?.href || ''
                return ({title,link})
            }
        ))
        for (let articl of scraped ){
            if (articl.link){
                        const response = await axios.get(articl.link)
                        if (response.status == 200){
                            console.log('scraping context...')
                            const html = await response.data
                            const $ = cheerio.load(html)
                            const contextData = $('.cols-a').find('p').text().replace("{{ key }}: {{ error[0] }}\n        بريدك الالكتروني\n        \n        اشتراك\n    10922 V 27500 7/8Satellite : Nilesat 7.0 ° West", "")
                            scrapedData.push({
                                'title': articl.title,
                                'link': articl.link,
                                'context': contextData
                            })
                        }
                        else {
                            throw new Error("Failed scraping the context")
                        }
            } else {
                continue;
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
run();